<template>
  <v-app>
    <v-container fluid>
      <header class="text-center py-6">
        <h1 class="text-h4 text-yellow-lighten-1 mb-6">
          <v-img
            :src="pokeBallIcon"
            alt="Poke Ball Logo"
            :width="32"
            :height="32"
            class="mr-2 d-inline-block align-middle"
          />
          Pokémon Explorer
        </h1>

        <v-responsive max-width="600" class="mx-auto">
          <v-text-field
            v-model="searchName"
            label="Search Pokémon..."
            variant="solo"
            hide-details
            clearable
            prepend-inner-icon="mdi-magnify"
          ></v-text-field>
        </v-responsive>
      </header>

      <div class="d-flex flex-wrap justify-center ga-2 mb-8">
        <v-btn
          v-for="type in typeColorList"
          :key="type.name"
          @click="toggleTypeFilter(type.name)"
          :color="type.color"
          :variant="selectedTypes.includes(type.name) ? 'flat' : 'outlined'"
          size="small"
          style="border-radius: 15px"
          class="text-capitalize"
        >
          {{ type.name }}
        </v-btn>
      </div>

      <v-row v-if="loading && !pokemons.length" justify="center" class="my-10">
        <v-col cols="12" class="text-center text-h6 text-blue-lighten-2">
          <v-progress-circular
            indeterminate
            color="blue-lighten-2"
            class="mr-3"
          ></v-progress-circular>
          Ładowanie Pokémonów...
        </v-col>
      </v-row>
      <v-alert v-else-if="error" type="error" class="mx-auto my-6" max-width="800">
        Wystąpił błąd: {{ error.message }}
      </v-alert>

      <v-row v-else>
        <v-col v-for="pokemon in pokemons" :key="pokemon.id" cols="12" sm="6" lg="4" xl="3">
          <PokemonCard :pokemon="pokemon" />
        </v-col>
      </v-row>
      <!-- TODO show more (brak czasu na paginacje :[ ) -->
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePokemonStore } from '/src/stores/mainStore'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { typeColorList } from '/src/utils/colors.js'

import PokemonCard from '/src/components/PokemonCard.vue'
import pokeBallIcon from '@/assets/poke-ball.png'

const { pokemons, loading, error } = storeToRefs(usePokemonStore())
const { getAllPokemons } = usePokemonStore()

const searchName = ref('')
const selectedTypes = ref([])

onMounted(async () => {
  await getAllPokemons({})
})

const toggleTypeFilter = (type) => {
  const index = selectedTypes.value.indexOf(type)

  if (index === -1) {
    selectedTypes.value.push(type)
  } else {
    selectedTypes.value.splice(index, 1)
  }
}

watch(
  [searchName, selectedTypes.value],
  async () => {
    await getAllPokemons({ name: searchName.value, type: selectedTypes.value })
  },
  { deep: true },
)
</script>

<style scoped></style>
