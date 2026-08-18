const PaymentLedger = require('../models/PaymentLedger');
const { validateLedgerSubmission } = require('../utils/validators');
const { isRealPdf, saveUploadedFile } = require('../utils/fileValidation');
const { validateLedgerVerification } = require('../utils/validators');


async function submitLedger(req, res) {
  
  const errors = validateLedgerSubmission(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

 
  
  if (!req.file) {
    return res.status(400).json({ error: 'A receipt PDF is required' });
  }

  
  if (!isRealPdf(req.file.buffer)) {
    return res.status(400).json({ error: 'Uploaded file is not a valid PDF' });
  }

  
  const filename = await saveUploadedFile(req.file.buffer, '.pdf');

  const { academicYear, vtuDuReference, vtuRentAmount, ddNumber, ddBankName, messFeeAmount } = req.body;

  let ledger;
  try {
    ledger = await PaymentLedger.create({
      studentId: req.user.id,     
      usn: req.user.usn,
      academicYear,
      vtuDuReference,
      vtuRentAmount: Number(vtuRentAmount),
      vtuReceiptPdfUrl: filename,
      ddNumber,
      ddBankName,
      messFeeAmount: Number(messFeeAmount),
    });
  } catch (err) {
    if (err.code === 11000) {
      
      return res.status(409).json({
        error: 'A ledger for this year already exists, or this payment reference/DD number has already been used',
      });
    }
    throw err;
  }

  return res.status(201).json({ ledger });
}


async function listLedgers(req, res) {
  const { status } = req.query;
  const filter = status ? { $or: [{ vtuRentStatus: status }, { messDdStatus: status }] } : {};
  const ledgers = await PaymentLedger.find(filter).sort({ createdAt: -1 }).lean();
  return res.status(200).json({ ledgers });
}


async function verifyLedger(req, res) {
  const errors = validateLedgerVerification(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  const ledger = await PaymentLedger.findById(req.params.id);
  if (!ledger) return res.status(404).json({ error: 'Ledger not found' });

  const { stream, status } = req.body;
  if (stream === 'vtuRent') ledger.vtuRentStatus = status;
  else ledger.messDdStatus = status;
  ledger.verifiedByStaffId = req.user.id;

  await ledger.save();
  return res.status(200).json({ ledger });
}

module.exports = { submitLedger, listLedgers, verifyLedger };