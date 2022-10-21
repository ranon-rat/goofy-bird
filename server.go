package main

import (
	"net/http"
)

func main() {
	http.Handle("/", http.FileServer(http.Dir("./")))
	http.HandleFunc("/upload-model", func(w http.ResponseWriter, r *http.Request) {

	})
	http.ListenAndServe(":8080", nil)
}
