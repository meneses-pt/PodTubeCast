var exports = module.exports = {};

exports.isURL = function(str) {
	return /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(str); 
}
