const axios = require("axios");
const env = require("../../utils/dotenvConfig");
const Constants = require("../../constants/Constants");
const Messages = require("../../constants/Messages");
const CircuitBreaker = require("opossum");
const {
  models: { documents: Document },
} = require("docuvault-database");

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
      if (error.response && error.response.status === 400) {
        throw error;
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
    const { document_id, user_id, format, convert_format } = req.body;

    if (!document_id || !format || !user_id) {
      return res.status(Constants.STATUS_CODES.BAD_REQUEST).json({
        success: false,
        error: Messages.VALIDATION.DOCUMENT_ID_FORMAT_OBJECT,
        correlationId,
      });
    }
    const document = await Document.findOne({
      where: { id: document_id },
    });

    if (!document) {
      return res.status(Constants.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Document not found",
        correlationId,
      });
    }

    const documentData = {
      document_id: document_id,
      user_id: user_id,
      format: format,
      convert_format: convert_format,
      correlationId: correlationId,
    };

    // Making call to the microservice
    const result = await conversionBreaker.fire(documentData);

    if (result.data && result.data.status === "SERVICE_UNAVAILABLE") {
      return res.status(503).json({
        success: false,
        error: `Service Unavailable: ${result.data.error}`,
        correlationId,
      });
    }
    //Return the response received from microservice
    return res.status(200).json(result.data);
  } catch (error) {
    console.error(`[${correlationId}] Document conversion failed:`, error);

    const errorResponse = {
      success: false,
      correlationId,
      error: Messages.ERROR.CONVERSION_FAILED,
    };
    if (error.response) {
      errorResponse.details = error.response.data;
      return res.status(error.response.status).json(errorResponse);
    }
    return res.status(500).json(errorResponse);
  }
};

module.exports = {
  convertDocument,
};
