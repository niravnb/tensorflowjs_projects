const webcamElement = document.getElementById('webcam');
const classifier = knnClassifier.create();
const delay = ms => new Promise(res => setTimeout(res, ms));

let net;

// async function app() {
//   console.log('Loading mobilenet..');

//   // Load the model.
//   net = await mobilenet.load();
//   console.log('Successfully loaded model');

//   // Create an object from Tensorflow.js data API which could capture image 
//   // from the web camera as Tensor.
//   const webcam = await tf.data.webcam(webcamElement);

//   // Reads an image from the webcam and associates it with a specific class
//   // index.
//   const addExample = async classId => {
//     // Capture an image from the web camera.
//     const img = await webcam.capture();

//     // Get the intermediate activation of MobileNet 'conv_preds' and pass that
//     // to the KNN classifier.
//     const activation = net.infer(img, 'conv_preds');

//     // Pass the intermediate activation to the classifier.
//     classifier.addExample(activation, classId);

//     // Dispose the tensor to release the memory.
//     img.dispose();
//   };

//   // When clicking a button, add an example for that class.
//   document.getElementById('class-a').addEventListener('click', () => addExample(0));
//   document.getElementById('class-b').addEventListener('click', () => addExample(1));
//   document.getElementById('class-c').addEventListener('click', () => addExample(2));

//   while (true) {
//     if (classifier.getNumClasses() > 0) {
//       const img = await webcam.capture();

//       // Get the activation from mobilenet from the webcam.
//       const activation = net.infer(img, 'conv_preds');
//       // Get the most likely class and confidences from the classifier module.
//       const result = await classifier.predictClass(activation);

//       const classes = ['A', 'B', 'C'];
//       document.getElementById('console').innerText = `
//         prediction: ${classes[result.label]}\n
//         probability: ${result.confidences[result.label]}
//       `;

//       // Dispose the tensor to release the memory.
//       img.dispose();
//     }

//     await tf.nextFrame();
//   }
// }

async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Successfully loaded model');
  
  // Create an object from Tensorflow.js data API which could capture image 
  // from the web camera as Tensor.
  const webcam = await tf.data.webcam(webcamElement);
  while (true) {
    const img = await webcam.capture();
    const result = await net.classify(img);

    document.getElementById('console').innerText = `
      prediction: ${result[0].className}\n
      probability: ${result[0].probability}
    `;
    
    
    // text to speech
    
    var text = result[0].className;
    text = encodeURIComponent(text);
    console.log(text);
    var url = "http://translate.google.com/translate_tts?tl=en&q=" + text + "&client=tw-ob";
    await $('audio').attr('src', url).get(0).play();

    
    
    // Dispose the tensor to release the memory.
    img.dispose();

    // Give some breathing room by waiting for the next animation frame to
    // fire.
    await tf.nextFrame();
    await delay(5000);
    // wait(5);
  }
}

    

app();