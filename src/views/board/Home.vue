<template>
  <b-card class="p-xl-4" style="margin-bottom: 2rem">
    <b-jumbotron border-variant="dark"
                 fluid
                 header="Witaj na stronie Centrum Krwiodawstwa"
                 header-level="4"
                 header-tag="div"
                 style="padding: 2rem 1rem 2rem">
    </b-jumbotron>

    <div>
      <b-card-group columns>
        <b-card
            :img-src="require('../../assets/blood_group_dose.jpg')"
            img-alt="Image"
            img-top
            title="Ile trwa cały proces?"
        >
          <b-card-text>
            Proces pobierania krwi zajmuje ok. godziny.
            Na początku wymagane jest wypełnienia formularza wstępnego.
            Dodatkowo przeprowadzane jest wstepne badanie.
            Samo pobranie krwi zajmuje około 10 minut.
          </b-card-text>
        </b-card>

        <b-card
            :img-src="require('../../assets/doses.jpg')"
            img-alt="Image"
            overlay>
        </b-card>

        <b-card :img-src="require('../../assets/blood_donation.png')"
                img-alt="Image" img-top
                title="Jakie skutki ma pobranie krwi?">
          <b-card-text>
            Sam zabieg pobrania krwi jest bezbolesny. Są jednak osoby, które odczuwają dyskomfort związany z
            wprowadzeniem igły.
          </b-card-text>
        </b-card>

        <b-card title="Rezerwacja terminu na pobranie">
          <b-card-text>
            Aby zarezerwować termin na pobranie krwi bądź osocza należy posiadać konto w systemie, które można utworzyć
            na stronie
            <b-link to="/register"> rejestracji.</b-link>
            Jeśli posiadasz juz konto, możesz się zalogować
            <b-link to="/login"> tutaj.</b-link>
            Po zalogowaniu - w panelu dawcy - będzie można zarezerwować termin, a także
            prześledzić historię rezerwacji oraz donacji. Dodatkowo
            dostępna jest graficzna reprezentacja archiwalnych donacji w postaci statystyk.
          </b-card-text>
        </b-card>

        <b-card>
          <b-card-title>Jakie są zalecenia przed pobraniem?</b-card-title>
          <b-card-text>
            <ul style="margin-left: -1rem">
              <li>bądź wyspanym</li>
              <li>w ciągu doby poprzedzającej oddanie krwi staraj się wypić dużo płynów</li>
              <li>unikaj nadmiernego wysiłku fizycznego</li>
              <li>ogranicz palenie papierosów</li>
              <li>przyjdź jak będziesz zdrowy</li>
              <li>w dniu pobrania oraz dniu poprzedzającym nie spożywać tłustych posikówy</li>
            </ul>
          </b-card-text>
        </b-card>

        <b-card
            :img-src="require('../../assets/statistics.png')"
            img-alt="Image"
            img-top>
        </b-card>
      </b-card-group>
    </div>
  </b-card>
</template>
