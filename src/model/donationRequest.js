export default class DonationRequest {
    constructor(date, amount, donationType, donorId, isReleased, reservationId) {
        this.date = date;
        this.amount = amount;
        this.donationType = donationType;
        this.donorId = donorId;
        this.isReleased = isReleased;
        this.reservationId = reservationId;
    }
}
