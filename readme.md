# BloodDonationCentre Application

The repository contains a Vue.js application for managing the blood donation centre.

## Technologies

Core technologies used in the project:

* Vue 2
* Vue Router
* Axios
* Bootstrap Vue

## Key application features

* User registration and login page ![](ui_screenshots/login.png)![](ui_screenshots/walidacja_danych.png)
* Logged donor can:
    * book an appointment for blood or plasma donation ![](ui_screenshots/dodanie_rezerwacji_panel_dawcy.png)
    * view new/archived reservations and donations ![](ui_screenshots/rezerwacje_dawca.png)![](ui_screenshots/historia_pobran_panel_dawcy.png)
    * view statistics about donations ![](ui_screenshots/statystyki_panel_dawcy.png)
* Logged employee can:
    * manage the donors' personal data ![](ui_screenshots/przegląd_dawców.png) ![](ui_screenshots/edycja_danych_dawcy.png)
    * book/manage appointments for donations![](ui_screenshots/rezerwacje_użytkownika.png) ![](ui_screenshots/zarezerwowane_terminy_all_donors.png)
    * manage/view donations ![](ui_screenshots/panel_pracownika_dodawanie_donacji.png)![](ui_screenshots/panel_pracownika_spis_donacji_magazyn.png)![](ui_screenshots/panel_pracownika_spis_donacji_wydane.png)
    * mark the release of doses of biological material to other entities ![](ui_screenshots/wydanie_dawki.png)
    * view statistics about stored biological material ![](ui_screenshots/statystyki_centrum_panel_pracownika.png)
* Admin can manage all employees in donation centre
* The system takes care of providing the appropriate interval between donations

More screenshot available [here](ui_screenshots)

