export const loggingMiddleware = (req, res, next) => {
  // Clonar el body para no modificar el original
  const bodyClone = JSON.parse(JSON.stringify(req.body || {}));
  
  // Ocultar datos sensibles
  if (bodyClone.password) bodyClone.password = '[PROTECTED]';
  
  console.log('\n--- Request Log ---');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Body:', bodyClone);

  // Capturar la respuesta
  const oldSend = res.send;
  res.send = function(data) {
    console.log('\n--- Response Log ---');
    console.log('Status:', res.statusCode);
    console.log('Response Body:', typeof data === 'string' ? JSON.parse(data) : data);
    console.log('----------------\n');
    
    oldSend.apply(res, arguments);
  };

  next();
}; 