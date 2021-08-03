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
            img-src="https://cdn.medme.pl/zdjecie/17561,840,440,1/grupa-krwi-a.jpg"
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
            img-src="https://bi.im-g.pl/im/77/39/16/z23303543Q,Warto-znac-swoja-grupe-krwi--oznaczenie-grupy-krwi.jpg"
            overlay>
        </b-card>

        <b-card img-alt="Image" img-src="https://www.eastcottvets.co.uk/uploads/Blogs/blooddonation.jpg" img-top
                title="Jakie skutki ma pobranie krwi?">
          <b-card-text>
            Sam zabieg pobrania krwi jest bezbolesny. Są jednak osoby, które odczuwają dyskomfort związany z
            wprowadzeniem igły.
          </b-card-text>
        </b-card>

        <b-card
            img-alt="Image"
            img-src="https://1.bp.blogspot.com/-jCNEDiu1kJc/XPfZ9DdVgKI/AAAAAAAAAVU/vPLjciZhyQ08N3qvXhqVQcXqG8R5iLvrACEwYBhgL/s1600/Zrzut%2Bekranu%2B%25287%2529.png"
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
                img-src="https://img.grouponcdn.com/seocms/aNG4Rq8286RemrggcnyzFR/las_vegas_restaurants-1243x746"
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
