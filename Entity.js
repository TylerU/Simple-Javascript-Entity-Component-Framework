//Entity Manager
function Entity(entityMan, compArr){
	this.EM = entityMan;
	this.name = this.EM.createEntity();	

	for (var i = 0; i < compArr.length; i++){
		this.EM.addComponent(this.name, compArr[i]);
	}
	
	return this.name;
}

Entity.prototype.getComponent = function(comp){
	return this.EM.getComponent(this.name, comp);	
}

Entity.prototype.addComponent = function(comp){
	return this.EM.addComponent(this.name, comp);	
}

Entity.prototype.removeComponent = function(comp){
	return this.EM.removeComponent(this.name, comp);	
}

Entity.prototype.hasComponent = function(comp){
	return this.EM.hasComponent(this.name, comp);	
}

Entity.prototype.remove = function(){
	return this.EM.removeEntity(this.name);	
}

try {
	module.exports = Entity;
} catch (e){

};