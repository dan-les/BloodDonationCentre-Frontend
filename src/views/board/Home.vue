<template>
  <b-container style="margin-top: 1rem">
    <div>
      <b-jumbotron border-variant="dark" header-level="4">
        <template #header> Witaj na stronie Centrum Krwiodawstwa</template>
      </b-jumbotron>
    </div>
    <div>
      <b-card-group columns>
        <b-card
            img-alt="Image"
            :img-src="require('../../assets/blood_group_dose.jpg')"
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
            img-alt="Image"
            :img-src="require('../../assets/doses.jpg')"
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

        <b-card
            img-alt="Image"
            :img-src="require('../../assets/statistics.png')"
            img-top>
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
            </ul>
          </b-card-text>
        </b-card>

        <b-card img-alt="Image"
                :img-src="require('../../assets/food.jpg')"
                img-top
                title="Co jeść przed pobraniem?">
          <b-card-text>
            Przed pobraniem krwi należy zjeść lekkostrawny posiłek, ponieważ krew przetłuszczona jest niezdatna do celów
            medycznych. Należy zatem w dniu pobrania oraz dniu poprzedzającym nie spożywać tłustych posików.
          </b-card-text>
        </b-card>
      </b-card-group>
    </div>
    <div>
      <b-jumbotron bg-variant="light" header-level="5" style=" margin-top:4rem; padding: 0.9rem; border: 0rem"
                   text-variant="secondary">
        <div>
          Aplikacja została wykonana w ramach pracy inżynierskiej przez Daniela Leśniewicza w 2021 roku.
        </div>
      </b-jumbotron>
    </div>
  </b-container>
</template>
