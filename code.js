setRequestMethod(event) {
  switch (event.target.value) {
    case "get":
      this.selectedMethod = "get"
      console.log(event.target.value)
      break;
    case "post":
      this.selectedMethod = "post"
      console.log(event.target.value)
      break;
    case "put":
      this.selectedMethod = "put"
      console.log(event.target.value)
      break;
    case "delete":
      this.selectedMethod = "delete"
      console.log(event.target.value)
      break;
  }
},
