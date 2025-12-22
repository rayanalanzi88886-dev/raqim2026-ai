const apiKey = 'AIzaSyAHZiRcRqhpVKhng0DhKCslp5o5YME34X8';

async function listModels() {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
  const data = await response.json();
  
  if (data.models) {
    console.log('Available models:');
    data.models.forEach(m => {
      if (m.supportedGenerationMethods?.includes('generateContent')) {
        console.log(`- ${m.name.replace('models/', '')}`);
      }
    });
  } else {
    console.log('Error:', data);
  }
}

listModels();
