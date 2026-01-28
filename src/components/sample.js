import { defineComponent, ref } from 'vue';

export default ({ app }) => {
  app.component(
    'button-counter',
    defineComponent({
      name: 'ButtonCounter',
      setup() {
        const count = ref(0);
        return { count };
      },
      template: `
        <button @click="count++">
          You clicked me {{ count }} times.
        </button>
      `
    })
  );
};
