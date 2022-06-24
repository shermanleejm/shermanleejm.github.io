<template>
  <div style="width: 100%">
    <DataTable :value="skills" stripedRows responsiveLayout="scroll">
      <template #header> Screen B </template>
      <Column field="name" header="TSC Title"></Column>
      <Column
        field="proficiencies"
        header="Proficiency Levels"
        bodyStyle="text-align: center"
      >
        <template #body="item">
          <div id="timeline-container">
            <Button
              v-for="(proficiency, index) in item.data.proficiencies"
              :class="'p-button-rounded' + getButtonClass(proficiency.value)"
              :key="index"
              id="timeline-dots"
              v-tooltip.top="
                `${proficiency.name} of ${item.data.name} refers to lorem ipsum dolor sit amet, consectetur adipiscing elit.`
              "
            >
            </Button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";

export default {
  name: "ScreenB",
  components: {
    DataTable,
    Column,
    Button,
  },
  methods: {
    getButtonClass(value) {
      switch (value) {
        case 0:
          return " p-button-secondary";
        case 1:
          return "";
        case 2:
          return " p-button-warning";
      }
    },
  },
  computed() {},
  data() {
    return {
      skills: [
        {
          name: "Pythonic Deduction",
          proficiencies: [
            { name: "Level 1", value: 1 },
            { name: "Level 2", value: 1 },
            { name: "Level 3", value: 1 },
            { name: "Level 4", value: 2 },
            { name: "Level 5", value: 0 },
            { name: "Level 6", value: 0 },
          ],
        },
        {
          name: "Business Cents",
          proficiencies: [
            { name: "Level 1", value: 1 },
            { name: "Level 2", value: 1 },
            { name: "Level 3", value: 2 },
            { name: "Level 4", value: 0 },
            { name: "Level 5", value: 0 },
            { name: "Level 6", value: 0 },
          ],
        },
        {
          name: "Business Management",
          proficiencies: [
            { name: "Level 1", value: 1 },
            { name: "Level 2", value: 1 },
            { name: "Level 3", value: 1 },
            { name: "Level 4", value: 1 },
            { name: "Level 5", value: 2 },
            { name: "Level 6", value: 0 },
          ],
        },
      ],
    };
  },
};
</script>

<style>
#timeline-container {
  display: flex;
  gap: 30px;
}

.p-column-header-content {
  text-align: center;
}
</style>
