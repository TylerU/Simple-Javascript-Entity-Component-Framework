Simple-Javascript-Entity-Component-Framework
============================================

A straightforward entity manager written in Javascript intended for use as a framework for browser games. 

This is a fairly strict interpretation of the idea of an 'entity component' framework. Currently, I provide only a simple entity/component manager. Entites are just string identifiers that correspond to a list of components. These components can be any javascript object with a 'name' field, and I provide no base class to inherit from. I also provide no framework for the creation of systems, factories, or entities. 

The Entity.js file contains a helper class for creating and manipulating Entities. 

Suggested Usage
-----

Create some components:
```javascript
var Spatial = function(x1, y1, ro, wid, hei){
	if (x1)
		this.x=x1;
	else
		this.x=0;

	if (y1)
		this.y=y1;
	else
		this.y=0;
	
	if (ro)
		this.rot=ro;
	else
		this.rot=0;

	if (wid)
		this.width=wid;
	else
		this.width=0;

	if (hei)
		this.height=hei;
	else
		this.height=0;
}
//Important, we must have a name field
Spatial.prototype.name = "Spatial";



var Movement = function(x,y, app){
	this.apply = app;
	
	if (this.apply == null){
		this.apply = true;	
	}
	
	this.vec  = new Vec2(x,y);
}
Movement.prototype.name = "Movement";
```


Create a subsystem:
```javascript
var SubSystemMovement = function(EntityMan){
	this.EM = EntityMan;

	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("Movement");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var move = this.EM.getComponent(ent,"Movement");
				var pos = this.EM.getComponent(ent,"Spatial");
				
				if (move.apply){
					pos.x = pos.x + move.vec.getX() * delta;
					pos.y = pos.y + move.vec.getY() * delta;
				}
			}
		}
	}	
}
```



Create an entity: 

```javascript
var newEnt = new Entity(EntityManager, [/* Array of new component objects */ new Movement(), new Spatial()]);
```


Tie it all together:
```javascript
var SubMovement = new SubSystems.SubSystemMovement(EntityManager);
var SubSystems = [SubMovement, /*More stuff */];

/*Some time later*/
		for (var j = 0; j < SubSystems.length; j++){
			SubSystems[j].update(delta / 1000);	
		}
```
