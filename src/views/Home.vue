<template>
  <b-container style="margin-top: 1rem">
    <div>
      <b-jumbotron border-variant="dark">
        <template #header> Witaj na stronie Centrum Krwiodawstwa</template>

        <template #lead>
          Zaloguj się!
        </template>


      </b-jumbotron>
    </div>

    <div>
      <b-card-group columns>
        <b-card
            img-alt="Image"
            img-src="https://cdn.medme.pl/zdjecie/17561,840,440,1/grupa-krwi-a.jpg"
            img-top
            title="Card title that wraps to a new line"
        >
          <b-card-text>
            ...
          </b-card-text>
        </b-card>

        <b-card header="Quote">
          <blockquote class="blockquote mb-0">
            <p>Honorowym dawcą krwi nie zostaje się z powodu czekolady</p>
            <footer class="blockquote-footer">
              Someone famous in <cite title="Source Title">Source Title</cite>
            </footer>
          </blockquote>
        </b-card>

        <b-card img-alt="Image" img-src="https://www.eastcottvets.co.uk/uploads/Blogs/blooddonation.jpg" img-top
                title="Title">
          <b-card-text>
            This card has supporting text below as a natural lead-in to additional content.
          </b-card-text>
          <b-card-text class="small text-muted">Last updated 3 mins ago</b-card-text>
        </b-card>

        <b-card bg-variant="primary" text-variant="white">
          <blockquote class="card-blockquote">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
            <footer>
              <small>Someone famous in <cite title="Source Title">Source Title</cite></small>
            </footer>
          </blockquote>
        </b-card>

        <b-card>
          <b-card-title>Title</b-card-title>
          <b-card-text>
            This card has supporting text below as a natural lead-in to additional content.
          </b-card-text>
          <b-card-text class="small text-muted">Last updated 3 mins ago</b-card-text>
        </b-card>

        <b-card
            img-alt="Image"
            img-src="https://bi.im-g.pl/im/77/39/16/z23303543Q,Warto-znac-swoja-grupe-krwi--oznaczenie-grupy-krwi.jpg"
            overlay></b-card>

        <b-card
            img-alt="Image"
            img-src="https://1.bp.blogspot.com/-jCNEDiu1kJc/XPfZ9DdVgKI/AAAAAAAAAVU/vPLjciZhyQ08N3qvXhqVQcXqG8R5iLvrACEwYBhgL/s1600/Zrzut%2Bekranu%2B%25287%2529.png"
            img-top>
          <b-card-text>
            This is a wider card with supporting text below as a natural lead-in to additional content.
            This card has even longer content than the first.
          </b-card-text>
          <template #footer>
            <small class="text-muted">Footer Text</small>
          </template>
        </b-card>
      </b-card-group>
    </div>
    <!--    <div>-->

  </b-container>
  <!--  <div class="container">-->
  <!--&lt;!&ndash;    <header class="jumbotron">&ndash;&gt;-->
  <!--&lt;!&ndash;      <h3>{{ content }}</h3>&ndash;&gt;-->
  <!--&lt;!&ndash;    </header>&ndash;&gt;-->


  <!--    </div>-->
  <!--  </div>-->
</template>

<script>
import UserService from '../services/user.service';

export default {
  name: 'Home',
  data() {
    return {
      content: ''
    };
  },
  mounted() {
    UserService.getPublicContent().then(
        response => {
          this.content = response.data;
        },
        error => {
          this.content =
              (error.response && error.response.data && error.response.data.message) ||
              error.message ||
              error.toString();
        }
    );
  }
};
</script>
