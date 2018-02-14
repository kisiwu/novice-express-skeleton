
exports = module.exports = NoviceRouteCollection;

function NoviceRouteCollection(prefix, resource)
{   
    
    if (prefix != null && typeof prefix == 'object') {
        var obj = prefix;
        prefix = obj.prefix;
        resource = obj.resource;
    }
    
    this.type = "file";
    
    this.prefix = prefix || '/';
    
    var resourceFile = resource || undefined;
    
    this.getResource = function() { return resourceFile };
};