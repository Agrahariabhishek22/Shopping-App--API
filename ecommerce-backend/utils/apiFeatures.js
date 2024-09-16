class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            // regex-regular expression is used to search for string with similar pattern
            $regex: this.queryStr.keyword,
            // regex option-> i-ignore case means make it case insensitive
            $options: "i",
          },
        }
      : {};
    // console.log({...keyword});

    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryCopy = { ...this.queryStr };

    //  remove some fields from queryStr like keyword,page,limit
    // filter for category
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // filter for price and rating
    console.log(queryCopy);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    console.log(queryStr);

    this.query = this.query.find(JSON.parse(queryStr));
    // this.query=this.query.find(queryCopy);
    return this;
  }
  pagination(resultPerPage){
    const currentPage=Number(this.queryStr.page)||1;
    const skip=resultPerPage*(currentPage-1);
    this.query=this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
