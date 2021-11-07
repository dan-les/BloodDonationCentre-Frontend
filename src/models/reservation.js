export default class Reservation {
    constructor(id, donorId, donorFirstName, donorLastName, pesel, date, time, donationType, isAppointmentFinished) {
        this.id = id;
        this.donorId = donorId;
        this.donorFirstName = donorFirstName;
        this.donorLastName = donorLastName;
        this.pesel = pesel;
        this.date = date;
        this.time = time;
        this.donationType = donationType;
        this.isAppointmentFinished = isAppointmentFinished;
    }
}
