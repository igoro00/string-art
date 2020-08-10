# string-art

Tool to create string art written in p5.js

## ToDo

* [x] Create a simple HTML page
* [x] Import p5.js
  * [x] [https://cdn.jsdelivr.net/npm/p5@1.1.9/lib/p5.js](https://cdn.jsdelivr.net/npm/p5@1.1.9/lib/p5.js)
* [x] Create canvas
* [x] Create loom
  * [x] number each pin in an array
  * [ ] slider or textinput for
    * [ ] number of pins
    * [ ] number of connections
    * [ ] diameter of the loom (in cm)
* [x] function to connect pin to a pin with string
* [x] load image from the user
* [x] preprocess the image
* [ ] Create the algorithm to find the path
  * [ ] start at random pin
  * [ ] loop through every pin and check how closer to the input image are we
  * [ ] pick the best pin and connect to it
  * [ ] save the move to the array of moves
  * [ ] calculate used string lenght and add it to some variable
  * [ ] start the function again, starting from where we left
* [ ] generate a file with steps (list of pin's indexes) to recreate this irl
* [ ] generate .png file of the loom
* [ ] serve these files for user to download

## Additional features

* [ ] configurable color of the string/background
