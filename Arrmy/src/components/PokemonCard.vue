<template>
  <v-card
    :style="{ background: cardColor }"
    class="rounded-xl pa-4 shadow-lg transition-transform hover-scale-105 cursor-pointer"
  >
    <v-card-text class="d-flex align-center pa-0">
      <v-img
        :src="localDetails?.sprites?.front_default"
        :alt="localDetails?.name"
        class="pokemon-image flex-grow-0 mr-4"
        width="100"
        height="100"
      ></v-img>

      <div>
        <h2 class="text-h5 font-weight-bold">{{ localDetails?.name }}</h2>
        <p class="text-subtitle-1 opacity-70 mb-2">
          {{ formattedId }}
        </p>

        <div class="d-flex ga-2">
          <v-chip
            v-for="type in localDetails?.types"
            :key="type"
            size="small"
            label
            class="text-capitalize font-weight-medium"
            style="border-radius: 10px"
          >
            {{ type.type.name }}
          </v-chip>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePokemonStore } from '/src/stores/mainStore'
import { typeColors } from '/src/utils/colors.js'

const props = defineProps({
  pokemon: Object,
})

const { loadPokemonDetails } = usePokemonStore()

const localDetails = ref(null)

onMounted(async () => {
  localDetails.value = await loadPokemonDetails(props.pokemon.name)
})

const formattedId = computed(() => {
  if (!localDetails.value || !localDetails.value.id) return '???'

  const id = localDetails.value.id

  if (id < 10) {
    return `#00${id}`
  } else if (id < 100) {
    return `#0${id}`
  } else {
    return `#${id}`
  }
})

const cardColor = computed(() => {
  const getColorValue = (type) => {
    return typeColors[type] || typeColors.normal
  }

  if (!localDetails.value || !localDetails.value.types || localDetails.value.types.length === 0) {
    return getColorValue('normal')
  }

  const types = localDetails.value.types
  const primaryType = types[0].type.name
  const secondaryType = types.length > 1 ? types[1].type.name : primaryType

  const primaryColor = getColorValue(primaryType)
  const secondaryColor = getColorValue(secondaryType)
  return `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
})
</script>

<style scoped>
.hover-scale-105:hover {
  transform: translateY(-5px);
}

.pokemon-image {
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.4));
}
</style>
