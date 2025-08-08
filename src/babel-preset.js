module.exports = function() {
  return {
    plugins: [
      require('./babel-plugin/index.js') 
    ]
  };
};