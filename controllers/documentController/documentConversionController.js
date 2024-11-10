const axios = require("axios");
const env = require("../../utils/dotenvConfig");
const Constants = require("../../constants/Constants");
const Messages = require("../../constants/Messages");
const CircuitBreaker = require("opossum");

const CONVERSION_SERVICE_URL = process.env.CONVERSION_SERVICE_URL;
const CONVERSION_TIMEOUT = parseInt(process.env.CONVERSION_SERVICE_TIMEOUT);

const conversionBreaker = new CircuitBreaker(
  async function (document) {
    try {
      const response = await axios.post(
        `${CONVERSION_SERVICE_URL}/api/convert_document`,
        document,
        {
          timeout: CONVERSION_TIMEOUT,
          headers: {
            "x-correlation-id": document.correlationId,
          },
        }
      );
      return response;
    } catch (error) {
      // Check if it's a specific error (e.g., 400) that shouldn't trigger fallback
      if (error.response && error.response.status === 400) {
        throw error; // Allows it to be handled in `convertDocument` without fallback
      }
      throw new Error("Service temporarily unavailable");
    }
  },
  {
    timeout: CONVERSION_TIMEOUT,
    errorThresholdPercentage: 50,
    resetTimeout: 1,
    name: "documentConversion",
  }
);

// Set up fallback specifically for unhandled errors (e.g., 503 Service Unavailable)
conversionBreaker.fallback(() => ({
  error: "Conversion service temporarily unavailable",
  status: "SERVICE_UNAVAILABLE",
}));

conversionBreaker.on("timeout", () => {
  console.error("Conversion service timeout");
});

conversionBreaker.on("reject", () => {
  console.error("Circuit breaker rejected the request");
});

const convertDocument = async (req, res) => {
  const correlationId =
    req.headers["x-correlation-id"] ||
    `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    const { document_id, user_id, format, metadata } = req.body;

    if (!document_id || !format || !user_id) {
      return res.status(Constants.STATUS_CODES.BAD_REQUEST).json({
        success: false,
        error: Messages.VALIDATION.DOCUMENT_ID_FORMAT_OBJECT,
        correlationId,
      });
    }

    const documentData = {
      document_id,
      format,
      metadata: metadata || {},
      correlationId,
      user_id,
    };

    console.log(
      `[${correlationId}] Starting document conversion for document: ${document_id}`
    );
    const result = await conversionBreaker.fire(documentData);

    // Check for fallback response
    if (result.data && result.data.status === "SERVICE_UNAVAILABLE") {
      return res.status(503).json({
        success: false,
        error: `Service Unavailable: ${result.data.error}`,
        correlationId,
      });
    }

    console.log(
      `[${correlationId}] Document conversion completed successfully`
    );

    return res.status(200).json({
      success: true,
      data: result.data,
      correlationId,
    });
  } catch (error) {
    console.error(`[${correlationId}] Document conversion failed:`, error);

    const errorResponse = {
      success: false,
      correlationId,
      error: Messages.ERROR.CONVERSION_FAILED,
    };

    // Handle specific error codes, e.g., 400
    if (error.response) {
      errorResponse.details = error.response.data;
      return res.status(error.response.status).json(errorResponse);
    }

    // Fallback for unknown errors (500)
    return res.status(500).json(errorResponse);
  }
};

module.exports = {
  convertDocument,
};
