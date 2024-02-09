let apiCallCount = 0;

const countAPICalls = async (req, res, next) => {

    apiCallCount = apiCallCount + 1;

    console.log(`Total API calls: ${apiCallCount}`);
  
    next();
};

module.exports = countAPICalls;
