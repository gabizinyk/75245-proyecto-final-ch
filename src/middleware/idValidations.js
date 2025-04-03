const checkIdLength = (req, res, next) => {
    
  if ((req.params.pid) && (req.params.pid.length < 24 || req.params.pid.length > 24)) {
    res.setHeader("Content-Type", "application/json");
    res.status(400).json({ Msg: "El 'pid' no tiene el formato correcto" });
    return;
  } 
  
  if ((req.params.cid) && (req.params.cid.length < 24 || req.params.cid.length > 24)) {
    console.log('CHEQUEA!!!!!!!')
    res.setHeader("Content-Type", "application/json");
    res.status(400).json({ Msg: "El 'cid' no tiene el formato correcto" });
    return;
  }

  next();
};

module.exports = { checkIdLength };
