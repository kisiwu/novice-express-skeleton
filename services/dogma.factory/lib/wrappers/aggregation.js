const AGGREGATE_METHODS = [
  "collStats",
  "project",
  "match",
  "redact",
  "limit",
  "skip",
  "unwind",
  "group",
  "sample",
  "sort",
  "geoNear",
  "lookup",
  "out",
  "indexStats",
  "facet",
  "bucket",
  "bucketAuto",
  "sortByCount",
  "addFields",
  "count",
  "graphLookup"
];


module.exports = function Aggregation( model ) {

    return function start(){
      var aggregation = {};

      var chain = [];

      AGGREGATE_METHODS.forEach( verb => {
          aggregation[ verb ] = wrap( verb );
      } );

      function wrap( verb ) {
          return ( param ) => {

              // Wrap in the $verb
              var step = {};
              step[ '$' + verb ] = param;

              chain.push( step );
              return aggregation;
          };
      }

      // Execute aggregation
      aggregation.exec = function ( callback ) {
        return model.aggregate(chain).exec(callback);
      };

      // Return the aggregation array/builder
      return aggregation;
    }
};
