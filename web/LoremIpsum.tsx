import { h } from "preact";
import { TextPageLayout } from "./components/TextPageLayout.tsx";

export function LoremIpsum() {
  return (
    <TextPageLayout>
      <h1>Lorem Ipsum</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.
        Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies
        sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius
        a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy
        molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.
        Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium
        a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra
        tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede.
        Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit
        sodales. Vestibulum ante ipsum primis in faucibus orci luctus et
        ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede
        pellentesque fermentum. Maecenas adipiscing ante non diam.
      </p>
      <h2>Vestibulum</h2>
      <p>
        In hac habitasse platea dictumst. Curabitur at lacus ac velit ornare
        lobortis. Curabitur a felis in nunc fringilla tristique. Morbi mattis
        ullamcorper velit. Phasellus gravida semper nisi. Nullam vel sem.
        Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec,
        quam. Sed lectus. Integer euismod lacus luctus magna. Quisque cursus,
        metus vitae pharetra auctor, sem massa mattis sem, at interdum magna
        augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et
        ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent
        blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum.
        Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc,
        viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt
        malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris.
        Morbi in dui quis est pulvinar ullamcorper.
      </p>
    </TextPageLayout>
  );
}
