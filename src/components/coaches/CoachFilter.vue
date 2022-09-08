<template>
  <div class="card">
    <div class="card-header">
      <h2 class="card-header-title is-size-5">Find Your Coach</h2>
    </div>
    <div class="is-flex p-5 is-justify-content-space-between is-flex-wrap-wrap">
      <span class="filter-options">
        <label for="speedrunner" class="checkbox p-3">
          <input type="checkbox" id="speedrunner" checked @change="setFilter" />
          Speed Runner
        </label>
      </span>
      <span class="filter-options">
        <label for="tournamentP" class="checkbox p-3">
          <input type="checkbox" id="tournamentP" checked @change="setFilter" />
          Tournament Player
        </label>
      </span>
      <span class="filter-options">
        <label for="tournamentO" class="checkbox p-3">
          <input type="checkbox" id="tournamentO" checked @change="setFilter" />
          Tournament Organizer
        </label>
      </span>
      <span class="filter-options">
        <label for="loremaster" class="checkbox p-3">
          <input type="checkbox" id="loremaster" checked @change="setFilter" />
          Lore Master
        </label>
      </span>
    </div>
  </div>
</template>

<script setup>
/*
    Imports
*/
import { reactive } from "vue";

/*
    Emits
*/
const emit = defineEmits(["change-filter"]);

/*
    Filters
*/
let filters = reactive({
  speedrunner: true,
  tournamentP: true,
  tournamentO: true,
  loremaster: true,
});

const setFilter = (event) => {
  const inputId = event.target.id;
  const isActive = event.target.checked;

  const updatedFilters = {
    ...filters,
    [inputId]: isActive,
  };
  filters = updatedFilters;

  emit("change-filter", updatedFilters);
};
</script>
