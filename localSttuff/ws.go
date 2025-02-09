package main

// import (
// 	"fmt"
// )

// func sendData(ch chan<- int) {
// 	ch <- 42
// }

// func main() {
// 	ch := make(chan int)

// 	sendCh := (chan<- int)(ch)
// 	go sendData(sendCh)

// 	readCh := (<-chan int)(ch)
// 	x := <-readCh
// 	fmt.Println(x)
// }
