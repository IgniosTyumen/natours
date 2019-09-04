const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json(
    {
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
};

const sendErrorProduction = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json(
      {
        status: err.status,
        message: err.message,
      });
  } else {
    console.error('ERROR!!!',err);

    res.status(500).json(
      {
        status: 'error',
        message: 'unhandled error',
      });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.status || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);

  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProduction(err, res);
  }
};

