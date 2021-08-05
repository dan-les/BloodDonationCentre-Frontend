export default class Donation {
    constructor(id, date, amount, donationType, donorId, donorFirstName, donorLastName,
                bloodGroupWithRh, isReleased, recipientId, recipientName) {
        this.id = id;
        this.date = date;
        this.amount = amount;
        this.donationType = donationType;
        this.donorId = donorId;
        this.donorFirstName = donorFirstName;
        this.donorLastName = donorLastName;
        this.bloodGroupWithRh = bloodGroupWithRh;
        this.isReleased = isReleased;
        this.recipientId = recipientId;
        this.recipientName = recipientName;
    }
}
