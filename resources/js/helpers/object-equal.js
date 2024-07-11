function check(a, b) {
	return (a == b) || (a == '' && b == '') || (a == null && b == null) || (a == null && b == '') || (a == '' && b == null)
}

export const paidEmployeObjectIsEqual = (value, other) => {
	let PaymentDate = check(value.PaymentDate, other.PaymentDate)
	let PaymentNote = check(value.PaymentNote,other.PaymentNote)
	let Signature = check(value.Signature, other.Signature)
	return PaymentDate && PaymentNote && Signature
}

export const transportEmpObjectIsEqual = (value, other) => {
	let Remarque = check(value.Remarque, other.Remarque)
	let PaymentDate = check(value.PaymentDate, other.PaymentDate)
	let Signature = check(value.Signature, other.Signature)
	return Remarque && Signature && PaymentDate
}

export const absenceObjectIsEqual = function (value, other) {
	// let from = check(value.AEFromDate, other.AEFromDate)
	// let to = check(value.AEToDate, other.AEToDate)
	let id = check(value.AbsenceEmployeID, other.AbsenceEmployeID)
	let employe = check(value.EmployeFID, other.EmployeFID)
	let remarque = check(value.Remarque, other.Remarque)
	let type = check(value.TypeAbsenceFID, other.TypeAbsenceFID)
	let Signature = check(value.Signature, other.Signature)
	let NbDay = check(value.NbDay, other.NbDay)
	return /*from && to &&*/ id && employe && remarque && type && Signature && NbDay
}

export const userObjectIsEqual = function (value, other) {
	let id = check(value.UserID, other.UserID)
	let name = check(value.UserName, other.UserName)
	let pass = check(value.Password, other.Password)
	let company = check(value.CompanyFID, other.CompanyFID)
	let admin = check(value.Admin, other.Admin)
	return id && name && pass && company && admin
}

export const typeObjectIsEqual = function (value, other) {
	let id = check(value.PhoneTypeID, other.PhoneTypeID)
	let phone = check(value.PhoneNumber, other.PhoneNumber)
	let type = check(value.Type, other.Type)
	let note = check(value.Note, other.Note)
	return id && phone && type && note
}


export const mvOrangeObjectIsEqual = function (value, other) {
	let id = check(value.TransactionID, other.TransactionID)
	let branch = check(value.CompanyFID, other.CompanyFID)
	let number = check(value.MVNumber, other.MVNumber)
	let type = check(value.Type, other.Type)
	let amount = check(value.MVAmount, other.MVAmount)
	let currency = check(value.MVCurrencyFID, other.MVCurrencyFID)
	let notes = check(value.MVNotes, other.MVNotes)
	let date = check(value.MVDate, other.MVDate)
	let response = check(value.USSDResponse, other.USSDResponse)
	let sent = check(value.Sent, other.Sent)
	return id && branch && number && amount && currency && notes && date && response && sent && type
}
