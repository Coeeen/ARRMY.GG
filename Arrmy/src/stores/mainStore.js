import { defineStore } from 'pinia'

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemons: [],
    loading: false,
    error: null,
  }),

  actions: {
    async getAllPokemons(params) {
      if (this.loading) return

      this.loading = true
      this.error = null

      const typeFilter = params.type || []
      const nameFilter = params.name || ''

      this.pokemons = []

      try {
        let rawResults = []

        if (typeFilter.length > 0) {
          const fetchPromises = typeFilter.map(async (type) => {
            const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`)
            if (!response.ok) throw new Error(`Błąd HTTP" ${response}`)
            const data = await response.json()
            return data.pokemon.map((p) => p.pokemon)
          })

          const resultsByTypes = await Promise.all(fetchPromises)

          if (resultsByTypes.length > 0) {
            rawResults = resultsByTypes[0]

            for (let i = 1; i < resultsByTypes.length; i++) {
              const nextTypeNamesArray = resultsByTypes[i].map((p) => p.name)
              rawResults = rawResults.filter((p) => nextTypeNamesArray.includes(p.name))
            }
          }
        } else {
          const url = new URL('https://pokeapi.co/api/v2/pokemon/')
          url.searchParams.set('limit', 24)

          const response = await fetch(url)
          if (!response.ok) throw new Error(`Błąd HTTP: ${response}`)

          const data = await response.json()
          rawResults = data.results
        }

        this.pokemons = rawResults

        if (nameFilter) {
          const query = nameFilter.toLowerCase()
          this.pokemons = this.pokemons.filter((p) => p.name.toLowerCase().includes(query))
        }
      } catch (error) {
        console.error('Error fetching Pokémon list:', error)
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async loadPokemonDetails(name) {
      try {
        const url = `https://pokeapi.co/api/v2/pokemon/${name}/`
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Błąd HTTP: ${response.status} podczas ładowania detali dla ${name}`)
        }

        const data = await response.json()

        return data
      } catch (error) {
        console.error(`Error fetching details for ${name}:`, error)
        throw error
      }
    },
  },
})
