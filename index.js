Vue.createApp({
  created() {
    this.getCities()
  },
  computed: {
    deleteBtnValidation () {
      return (this.selectedMethod === "delete")
    },
    cityInputValidation () {
      return (this.selectedMethod === "post" ||
        this.selectedMethod === "put")
    },
    populationInputValidation () {
      return (this.selectedMethod === "post" ||
      this.selectedMethod === "put")
    },
    idInputValidation () {
      return (this.selectedMethod === "delete" ||
      this.selectedMethod === "put")
    },
    requestBtnValidation () {
      switch (this.selectedMethod) {
        case "get":
          return true
        case "post":
          return (this.cityNameInput !== "" && this.populationInput !== "")
        case "put":
          return (this.cityId !== "" && this.cityNameInput !== "" && this.populationInput !== "")
        case "delete":
          return this.cityId !== ""
      }
    },
    btnTextHandler () {
      switch (this.selectedMethod) {
        case "get":
          return "get cities"
        case "post":
          return "add city"
        case "put":
          return "update city"
        case "delete":
          return "delete city"
      }
    }
  },

  data() {
    return {
      citiesData : null,
      cityNameInput: "",
      populationInput: "",
      cityId: "",
      loading: false,
      selectedMethod: "get",
      requestStatus: "",
      gotError: false
    }
  },
  watch: {
    selectedMethod() {
      // Clear inputfields when changing requestMethod(radiobuttons)
      this.cityNameInput = ""
      this.populationInput =""
      this.cityId = ""
      /* this.getCities() */
    }
  },

  methods: {
    addIdToInputField(idFromBtnClick) {
      this.cityId = idFromBtnClick
    },

    executeRequestMethod() {
      switch (this.selectedMethod) {
        case "get":
          this.getCities()
          console.log(this.selectedMethod)
          break;
        case "post":
          this.addCity()
          console.log(this.selectedMethod)
          break;
        case "put":
          this.updateCity()
          console.log(this.selectedMethod)
          break;
        case "delete":
          this.deleteCity()
          console.log(this.selectedMethod)
          break;
      }
    },

    getCities(previousReq) {
      this.loading = true
      fetch('https://avancera.app/cities/')
      .then(response => {
        if (response.ok) {
          return response.json()
        } else if(response.status === 404) {
          this.gotError = true
          this.requestStatus = "get request failed"
          return Promise.reject('error 404')
        } else {
          this.gotError = true
          this.requestStatus = "get request failed"
          return Promise.reject('some other error: ' + response.status)
        }
      })
      .then((result) => {
        console.log(result)
        this.gotError = false
        this.citiesData = result
        let prevReq = previousReq ? previousReq : "get";
        this.requestStatus = prevReq + " request succeeded"
      })
      .catch((error) => {
        this.gotError = true
        console.error('Error:', error);
        this.requestStatus = "get request failed"
      })
      .finally(() => {
        this.loading = false
      });
    },

    addCity() {
      this.loading = true
      fetch('https://avancera.app/cities/', {
        body: JSON.stringify({name : this.cityNameInput, population : Number(this.populationInput)}),
        headers: {
          'Content-Type' : 'application/json'
        },
        method: 'POST'
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else if(response.status === 404) {
          this.gotError = true
          this.requestStatus = "post request failed"
          return Promise.reject('error 404')
        } else {
          this.gotError = true
          this.requestStatus = "post request failed"
          return Promise.reject('some other error: ' + response.status)
        }
      })
      .then((result) => {
        console.log("result" + JSON.stringify(result))
        this.gotError = false
        this.getCities("post")
        this.requestStatus = "post request succeeded"
      })
      .catch((error) => {
        this.gotError = true
        console.error('Error:', error);
        this.requestStatus = "post request failed"
      })
      .finally(() => {
        this.loading = false
      });
    },

    updateCity() {
      this.loading = true
      fetch('https://avancera.app/cities/' + this.cityId, {
        body: JSON.stringify({id: this.cityId ,name: this.cityNameInput, population: Number(this.populationInput)}),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PUT'
      })
      .then(response => {
        if (!response.ok) {
          this.gotError = true
          this.requestStatus = "put request failed"
        } else {
          console.log(response)
          this.gotError = false
          this.getCities("put")
          this.requestStatus = "put request succeeded"
        }
      })
      .catch((error) => {
        this.gotError = true
        console.error('Error:', error);
        this.requestStatus = "put request failed"
      })
      .finally(() => {
        this.loading = false
      });
    },

    deleteCity(idFromDeleteBtn) {
      this.loading = true
      fetch(`https://avancera.app/cities/${idFromDeleteBtn !== undefined ? idFromDeleteBtn : this.cityId }`, {
        method: 'DELETE'
      }).then(response => {
        if (!response.ok) {
          this.gotError = true
          this.requestStatus = "delete request failed"
        } else {
          this.gotError = false
          this.getCities("delete")
          this.requestStatus = "delete request succeeded"
        }
      })
      .catch((error) => {
        this.gotError = true
        console.error('Error:', error);
        this.requestStatus = "delete request failed"
      })
      .finally(() => {
        this.loading = false
      });
    }

  }
}).mount('#app')

//const error = new Error("Error");
//error.response = response;
//throw error;
