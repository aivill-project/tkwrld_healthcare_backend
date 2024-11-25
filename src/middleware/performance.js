const performanceMiddleware = (req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;

    logger.info({
      path: req.path,
      method: req.method,
      duration: `${duration.toFixed(2)}ms`,
      status: res.statusCode
    });
  });

  next();
}; 