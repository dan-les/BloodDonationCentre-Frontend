export default class DonationRequest {
    constructor(date, amount, donationType, donorId, reservationId) {
        this.date = date;
        this.amount = amount;
        this.donationType = donationType;
        this.donorId = donorId;
        this.reservationId = reservationId;
    }
}
