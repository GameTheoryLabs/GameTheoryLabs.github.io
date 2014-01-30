var gl;

lerp = function(duration, startValue, endValue, time)
{
    return ((time * (endValue - startValue))/duration) + startValue;
}

CParticleEffect = function(sName, pos)
{
    var self = this;
	if(pos !== undefined)
		this.positionVector = pos;
	else
		this.positionVector = vec3.create();
    this.id = -1;
    this.name = sName;
    this.emitters = new os.resschmgr.Create.Map();
    this.Set = {
        Offset: function(x,y,z){
            for(var i = self.emitters.size; i--; self.emitters.next()){
                self.emitters.value().Entity.Offset[0] = x;
                self.emitters.value().Entity.Offset[1] = y;
                self.emitters.value().Entity.Offset[2] = z;
            }
        },
        Scale: function(x,y,z){
            for(var i = self.emitters.size; i--; self.emitters.next()){
                self.emitters.value().Entity.Scale[0] = x;
                self.emitters.value().Entity.Scale[1] = y;
                self.emitters.value().Entity.Scale[2] = z;
            }
        }
    }
    this.Attach = function(oEntity){
        //self.Entity.Attach(oEntity);
        for(var i = self.emitters.size; i--; self.emitters.next()){
            self.emitters.value().Entity.Attach(oEntity);
            self.emitters.value().Entity.Graphics.Set.rotation(oEntity.Graphics.Matrix.Rotation)
        }
    }
    this.addEmitter = function(particleCount, sTex, lifetime, pLifetime, r, g, b, a, loadLater)
    {
        var p = new CParticleEmitter(particleCount, sTex, lifetime, pLifetime, r, g, b, a, loadLater, this.positionVector);
        this.emitters.put(this.emitters.size, p);
        this.UpdateEntity();
        return p;
    }.bind(this);
    this.Entity = null;
    this.UpdateEntity = function()
    {
        if(this.emitters.size > 0)
            this.Entity = this.emitters.get(0).Entity;
        else
            this.Entity = null;
    }.bind(this)
    this.Update =  function(dt)
    {
        this.UpdateEntity();
        for(var i = 0; i < this.emitters.size; i++)
        {
            this.emitters.get(i).Update(dt);
            vec3.set(this.emitters.get(0).Entity.Position, this.emitters.get(i).Entity.Position);
            mat4.set(this.emitters.get(0).Entity.Graphics.Matrix.Rotation, this.emitters.get(i).Entity.Graphics.Matrix.Rotation);
            
            
        }
        
    }.bind(this);    
    
    this.Start =  function()
    {
        for(var i = 0; i < this.emitters.size; i++)
        {
			if(!this.emitters.get(i).loop)
				this.emitters.get(i).ResetParticles(this.Entity);
            this.emitters.get(i).Start();
        }
    }.bind(this);
    
    this.Stop =  function()
    {
        for(var i = 0; i < this.emitters.size; i++)
        {
            this.emitters.get(i).Stop();
			
        }
    }.bind(this);
    
    this.Draw =  function()
    {
        for(var i = 0; i < this.emitters.size; i++)
        {
            this.emitters.get(i).Draw();
        }
    }.bind(this);
    
    switch(sName)
    {
    case "thruster1":
        os.graphics.Managers.Texture.Create.Texture("smoke", "scripts/jahova/OS/Cores/Graphics/textures/smoke.png");
        os.graphics.Managers.Texture.Create.Texture("fire", "scripts/jahova/OS/Cores/Graphics/textures/fire.png"); 
        var e = this.addEmitter(25, "smoke", 10, .8, 1, .5, .0, .9, true);
        e.particleVelocity.min[0] = .3;
        e.particleVelocity.max[0] = .4;
        e.particleVelocity.min[1] = .01;
        e.particleVelocity.max[1] = .09;
        e.particleVelocity.min[2] = .01;
        e.particleVelocity.max[2] = .09;
        e.particleVelocity.neg[1] = 1;
        e.particleVelocity.neg[2] = 1;
        e.loop = true;
        e.Load();
        
        e = this.addEmitter(30, "fire", 10, .3, .6, .6, 1, .3, true);
        e.particleVelocity.min[0] = .2;
        e.particleVelocity.max[0] = .6;
        e.particleVelocity.min[1] = .01;
        e.particleVelocity.max[1] = .09;
        e.particleVelocity.min[2] = .01;
        e.particleVelocity.max[2] = .09;
        e.particleVelocity.neg[1] = 1;
        e.particleVelocity.neg[2] = 1;
        e.loop = true;
        e.Load();
        
        e = this.addEmitter(30, "smoke", 10, 1.5, 0.4, 0.4, 0.4, .45, true);
        e.particleVelocity.min[0] = .2;
        e.particleVelocity.max[0] = .6;
        e.particleVelocity.min[1] = .05;
        e.particleVelocity.max[1] = .2;
        e.particleVelocity.min[2] = .05;
        e.particleVelocity.max[2] = .2;
        e.particleVelocity.neg[1] = 1;
        e.particleVelocity.neg[2] = 1;
        e.loop = true;
        e.Load();
        break;
    case "thruster2":
        os.graphics.Managers.Texture.Create.Texture("smoke", "scripts/jahova/OS/Cores/Graphics/textures/smoke.png");
        os.graphics.Managers.Texture.Create.Texture("fire", "scripts/jahova/OS/Cores/Graphics/textures/fire.png"); 
        var e = this.addEmitter(40, "smoke", 10, 1, .95, .4, .1, .9, true);
        e.particleLifetime.max = .45;
        e.particleVelocity.min[0] = .3;
        e.particleVelocity.max[0] = .4;
        e.particleVelocity.min[1] = .01;
        e.particleVelocity.max[1] = .09;
        e.particleVelocity.min[2] = .01;
        e.particleVelocity.max[2] = .09;
        e.particleVelocity.neg[1] = 1;
        e.particleVelocity.neg[2] = 1;
        e.loop = true;
        e.Load();
        
        var e = this.addEmitter(40, "fire", 10, .1, .0, .0, .9, .9, true);
        e.particleLifetime.max = .1;
        e.particleVelocity.min[0] = .3;
        e.particleVelocity.max[0] = .4;
        e.particleVelocity.min[1] = .01;
        e.particleVelocity.max[1] = .09;
        e.particleVelocity.min[2] = .01;
        e.particleVelocity.max[2] = .09;
        e.particleVelocity.neg[1] = 1;
        e.particleVelocity.neg[2] = 1;
        e.loop = true;
        e.Load();
        
        e = this.addEmitter(10, "smoke", 10, 1.5, 0.4, 0.4, 0.4, .45, true);
        e.particleVelocity.min[0] = .2;
        e.particleVelocity.max[0] = .6;
        e.particleVelocity.min[1] = .05;
        e.particleVelocity.max[1] = .2;
        e.particleVelocity.min[2] = .05;
        e.particleVelocity.max[2] = .2;
        e.particleVelocity.neg[1] = 1;
        e.particleVelocity.neg[2] = 1;
        e.loop = true;
        e.Load();
        break;
    case "explosion":
        os.graphics.Managers.Texture.Create.Texture("smoke", "scripts/jahova/OS/Cores/Graphics/textures/smoke.png");
        os.graphics.Managers.Texture.Create.Texture("fire", "scripts/jahova/OS/Cores/Graphics/textures/fire.png");
        os.graphics.Managers.Texture.Create.Texture("spark", "scripts/jahova/OS/Cores/Graphics/textures/spark.jpg"); 
        var e = this.addEmitter(50, "smoke", 2.2, 2.2, 1, .4, .0, 1, true);
        e.maxOutputs = 5;
        e.particleVelocity.min[0] = .01;
        e.particleVelocity.max[0] = .3;
        e.particleVelocity.min[1] = .01;
        e.particleVelocity.max[1] = .3;
        e.particleVelocity.min[2] = .01;
        e.particleVelocity.max[2] = .3;
        e.particleVelocity.neg[1] = 1;
        e.particleVelocity.neg[2] = 1;
        e.particleVelocity.neg[0] = 1;
        e.Load();
		
		var e = this.addEmitter(50, "smoke", 2.2, 2.2, .1, .1, .1, 1, true);
        e.maxOutputs = 5;
        e.particleVelocity.min[0] = .01;
        e.particleVelocity.max[0] = .3;
        e.particleVelocity.min[1] = .01;
        e.particleVelocity.max[1] = .3;
        e.particleVelocity.min[2] = .01;
        e.particleVelocity.max[2] = .3;
        e.particleVelocity.neg[1] = 1;
        e.particleVelocity.neg[2] = 1;
        e.particleVelocity.neg[0] = 1;
        e.Load();
        
        var e = this.addEmitter(30, "spark", 10, .9, 1, .5, .0, .9, true);
        e.particleVelocity.min[0] = .01;
        e.particleVelocity.max[0] = .6;
        e.particleVelocity.min[1] = .01;
        e.particleVelocity.max[1] = .6;
        e.particleVelocity.min[2] = .01;
        e.particleVelocity.max[2] = .6;
        e.particleVelocity.neg[0] = 1;
        e.particleVelocity.neg[1] = 1;
        e.particleVelocity.neg[2] = 1;
        e.Load();
        break;
    }
    
}

CParticle = function()
{
    this.age = 0;
    this.lifetime = 0;
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.maxAlpha = this.color[3];
    this.vectors =
    {
        position: vec3.create(),
        velocity: vec3.create(),
        rotation: vec3.create(),
        copy: function(vec, Entity)
        {
            vec3.set(vec.position, this.position)
            vec3.set(vec.velocity, this.velocity)
            this.velocity[0] = (vec.velocity[0]*2) * Math.random();
            this.velocity[1] = (vec.velocity[1]*2) * Math.random();
            this.velocity[2] = (vec.velocity[2]*2) * Math.random();
            vec3.set(vec.rotation, this.rotation)
        }
    };
    this.resetVectors =
    {
        position: vec3.create(),
        velocity: vec3.create(),
        rotation: vec3.create(),
        copy: function(vec)
        {
            vec3.set(vec.position, this.position)
            vec3.set(vec.velocity, this.velocity)
            vec3.set(vec.rotation, this.rotation)
        }
    };
    this.active = true;
    
    this.Update = function(dt, entity, loop)
    {
		if(!(loop !== undefined))
			loop = false;
        if(this.active)
        { 
            this.age += (dt/1000);
            this.color[3] = this.maxAlpha - (this.age/this.lifetime);
            var scaleVel = vec3.create()
            vec3.scale(this.vectors.velocity, dt/100, scaleVel)
            vec3.add(this.vectors.position, scaleVel)
            if(this.age >= this.lifetime && loop)
                this.Reset(entity);
        }
        else{
            this.color[3] = 0;
        }
        this.resetVectors.position = entity.Position;
    }.bind(this);
    
    this.Reset = function(entity)
    {
        this.age = 0;
        this.vectors.copy(this.resetVectors, entity);
        mat4.multiplyVec3(entity.Graphics.Matrix.Rotation, this.resetVectors.rotation, this.resetVectors.rotation)
    }.bind(this);

    
}

CParticleColor = function(pr, pg, pb, pa, pv)
{
    var vDiv = [1,1,1,1];//particle varience diversity, the lower this is, the greater the change will be
    this.base =
    {
        r: pr,
        g: pg,
        b: pb,
        a: pa
    }
    this.r = {};
    this.r.min = pr - (Math.random() * pv)/vDiv[0];
    this.r.max = pr + pv/vDiv[0];
    this.r.pick = function()
    {
        return this.r.min + ((this.r.max - this.r.min) * Math.random());
    }.bind(this);
    this.g = {};
    this.g.min = pg - (Math.random() * pv)/vDiv[1];
    this.g.max = pg + pv/vDiv[1];
    this.g.pick = function()
    {
        return this.g.min + ((this.g.max - this.g.min) * Math.random());
    }.bind(this);
    this.b = {};
    this.b.min = pb - (Math.random() * pv)/vDiv[2];
    this.b.max = pb + pv/vDiv[2];
    this.b.pick = function()
    {
        return this.b.min + ((this.b.max - this.b.min) * Math.random());
    }.bind(this);
    this.a = {};
    this.a.min = pa - (Math.random() * pv)/vDiv[3];
    this.a.max = pa + pv/vDiv[3];
    this.a.pick = function()
    {
        return this.a.min + ((this.a.max - this.a.min) * Math.random());
    }.bind(this);
    this.getColor = function()
    {
        return [this.r.pick(), this.g.pick(), this.b.pick(), this.a.pick()];
    }.bind(this);
}


CParticleEmitter = function(particleCount, sTex, lifetime, pLifetime, r, g, b, a, loadLater, positionVector)
{
    var self = this;
	this.positionVector = positionVector;
    this.maxOutputs = 1;
    this.particles = new os.resschmgr.Create.Map();
    this.colors = new Array();
    this.colors.add = function(ptime, pcolor){this.colors.push({time: ptime, color: pcolor}); this.colors.sort(function(a,b){a.time - b.time})}.bind(this)
    this.particleCount = particleCount;
    this.activeParticles = 0;
    this.age = 0;
    this.id = -1;
    this.sTex = sTex;
    this.loop = false;
    this.lifetime = lifetime; //stored lifetime, for reset
    this.Entity = ParticleManager.CreateEntity();//os.graphics.Managers.Entity.Create();
    this.particleLifetime =
    {
        min: pLifetime - (pLifetime / 2),
        max: pLifetime,
        diff: function(){return this.max - this.min}
    }
    this.particleVelocity =
    {
        min: vec3.create(),
        max: vec3.create(),
        neg: [0,0,0]
    }
    this.clr = new CParticleColor(r, g, b, a, .2);
    
    this.mesh = null;
    this.active = false;
    this.CreateParticle = function()
    {
        var p = new CParticle();
        p.active = this.active;
        p.lifetime =  (Math.random() * this.particleLifetime.diff()) + this.particleLifetime.min;
        p.age = 0;
        p.color = [this.clr.r.pick(), this.clr.g.pick(),this.clr.b.pick(),this.clr.a.pick()];
        p.maxAlpha = p.color[3];
        p.vectors.position[0] = this.Entity.Position[0];
        p.vectors.position[1] = this.Entity.Position[1];
        p.vectors.position[2] = this.Entity.Position[2];
        p.vectors.velocity[0] = (Math.random() * (this.particleVelocity.max[0] - this.particleVelocity.min[0])) + this.particleVelocity.min[0];
        p.vectors.velocity[1] = (Math.random() * (this.particleVelocity.max[1] - this.particleVelocity.min[1])) + this.particleVelocity.min[1];
        p.vectors.velocity[2] = (Math.random() * (this.particleVelocity.max[2] - this.particleVelocity.min[2])) + this.particleVelocity.min[2];
        //mat4.multiplyVec3(this.Entity.Graphics.Matrix.Rotation, p.vectors.velocity, p.vectors.velocity)
        if(this.particleVelocity.neg[0] && Math.floor(p.vectors.velocity[0]*1000) % 2 == 0) p.vectors.velocity[0] *= -1;
        if(this.particleVelocity.neg[1] && Math.floor(p.vectors.velocity[1]*1000) % 2 == 0) p.vectors.velocity[1] *= -1;
        if(this.particleVelocity.neg[2] && Math.floor(p.vectors.velocity[2]*1000) % 2 == 0) p.vectors.velocity[2] *= -1;
        p.resetVectors.copy(p.vectors);
        p.resetVectors.position = this.Entity.Position;
        this.particles.put(this.particles.size, p)
        return p;
    }.bind(this)
    
    this.Start = function()
    {
        this.age = 0;
        this.active = true
    }.bind(this)
    
    this.Stop = function()
    {
        this.active = false
    }.bind(this)
    
    this.Load = function(particleCount, sTex)
    {
        if(this.particles.size > 0) return; //must unload first
        if(particleCount)
            this.particleCount = particleCount;
        if(sTex)
            this.sTex = sTex;
        
        this.mesh = os.graphics.Managers.Mesh.Create.Instanced("quad", "quad-" + //need to store these so that if someone requests
                                this.particleCount + "-I", this.particleCount); //two 500 counts, it doesnt have to allocate double
        this.mesh.model.vertexNormals = false;
        this.mesh.Initialize();
        this.Entity.Graphics.Add.Mesh("quad-" + this.particleCount + "-I")
        this.Entity.Graphics.Add.Texture(this.sTex);
        this.Entity.Position = this.positionVector;
        
        for(var i = 0; i < this.particleCount; ++i)
        {
            this.CreateParticle()
        }
    }.bind(this)
    
    this.Unload = function()
    {
        this.particles.removeAll();
        this.mesh = null;
    }.bind(this)
    
    this.Pause = false;
    
    this.Reset = function()
    {
        this.Stop();
        this.Start();
    }.bind(this)
	
	this.ResetParticles = function(entity)
    {
        for(i = 0; i < this.particles.size; i++){
			this.particles.get(i).Reset(this.Entity);	
		}
    }.bind(this)
    
    this.Update = function(dt)
    {
        if(this.Pause) return;
        if(this.active && dt/1000 < 100000)
        {
            this.age +=  dt/1000;
            

            for(i = 0; i < this.particles.size; i++){
                var p = this.particles.get(i);
                p.Update(dt, this.Entity, this.loop);
                this.Entity.Graphics.Instanced.position[i*3 +  0] = p.vectors.position[0];
                this.Entity.Graphics.Instanced.position[i*3 +  1] = p.vectors.position[1];
                this.Entity.Graphics.Instanced.position[i*3 +  2] = p.vectors.position[2];
                this.Entity.Graphics.Instanced.color[i*4 +  0] = p.color[0];
                this.Entity.Graphics.Instanced.color[i*4 +  1] = p.color[1];
                this.Entity.Graphics.Instanced.color[i*4 +  2] = p.color[2];
                this.Entity.Graphics.Instanced.color[i*4 +  3] = p.color[3];
            }
            
            for(var i = 0; i < this.maxOutputs; i++)
                if(this.activeParticles < this.particleCount)
                    this.particles.get(this.activeParticles++).active = true;
            
            if(this.age >= this.lifetime)
                if(this.loop)
                    this.Reset();
                else
                    this.Stop();
            
            
        }
        
    }.bind(this)

    
    this.Draw = function()
    {
        if(this.active)
        {
            this.Entity.Graphics.Draw()
        }
    }.bind(this)
    
    if(!(loadLater !== undefined))
        this.Load();
    

}

ParticleManager = 
{
    effects: null,//os.resschmgr.Create.Map(),
    Initalize: function()
    {
        //Load Particle VS and FS
        os.graphics.Managers.Shader.Create.VertexShader("particleVS", "scripts/jahova/OS/Cores/Graphics/shaders/particle.vs");
        os.graphics.Managers.Shader.Create.FragmentShader("particleFS", "scripts/jahova/OS/Cores/Graphics/shaders/particle.fs");
    
        //os.graphics.Managers.Texture.Create.Texture("fighter1", "scripts/jahova/OS/Cores/Graphics/textures/starhawk.jpg");
        //os.graphics.Managers.Texture.Create.Texture("spacestation", "scripts/jahova/OS/Cores/Graphics/textures/goliath.jpg");
        //os.graphics.Managers.Mesh.Create.Mesh("spacestation", "scripts/jahova/OS/Cores/Graphics/meshes/goliath.json");
        //os.graphics.Managers.Mesh.Create.Mesh("fighter1", "scripts/jahova/OS/Cores/Graphics/meshes/starhawk.json");
        //
        //var fighter1 = os.graphics.Managers.Entity.Create();
        //fighter1.Graphics.Add.Mesh("fighter1");
        //fighter1.Graphics.Add.Texture("fighter1");
        //fighter1.Graphics.Set.texture(false);
        //fighter1.Set.Scale(1,1,1);
        //fighter1.Set.Position(0,0,75);
        //fighter1.Graphics.Set.texture(true);
        //os.graphics.AddToWorld(fighter1);

        ParticleManager.effects = os.resschmgr.Create.Map();
        var quad = os.graphics.Managers.Mesh.Create.Primitive.Quad("quad");
        quad.Initialize();
        
        ParticleManager.CreateProgram();
        
          
    },
    
    Create: function(sName, particleCount, sTex, lifetime, particleLifetime)
    {
        var e = new CParticleEffect(sName);
        e.id = ParticleManager.effects.size;
        ParticleManager.effects.put(ParticleManager.effects.size, e)
        return e;
    },
        
    Update: function(dt)
    {
        for(var i = 0; i < ParticleManager.effects.size; i++)
        {
            ParticleManager.effects.get(i).Update(dt)
        }
    },

    Draw: function()
    {
        
        for(var i = 0; i < ParticleManager.effects.size; i++)
        {
            ParticleManager.effects.get(i).Draw()
        }
        
    },
    
    Start: function(id)
    {
        ParticleManager.effects.get(id).Start();
    },
    
    Stop: function(id)
    {
        ParticleManager.effects.get(id).Stop();
    },
    
    Reset: function(id)
    {
        ParticleManager.effects.get(id).Reset();
    },
    CreateProgram: function(){
        
        //Build Particle Program and Link
        var prgParticle = os.graphics.Managers.Shader.Create.Program("particleVS", "particleFS", "particlePrg");
        
        //Add Attributes to Particle Program
        prgParticle.CreateAttribute("aVertexPosition");
        //prgParticle.CreateAttribute("aVertexNormal");
        prgParticle.CreateAttribute("aTextureCoord");
        prgParticle.CreateAttribute("aInstance");
                        
        //Add Uniforms to Particle Program
        prgParticle.CreateUniform("uWMatrix");
        prgParticle.CreateUniform("uRMatrix");
        prgParticle.CreateUniform("uVMatrix");
        prgParticle.CreateUniform("uPMatrix");
        
        prgParticle.CreateUniform("uInstancePosition");
        prgParticle.CreateUniform("uInstanceColor");
        prgParticle.CreateUniform("uScale");
        prgParticle.CreateUniform("uOffset");
        
        prgParticle.CreateUniform("uSampler");
        
        
    },
    CreateEntity: function(){
        
        //Create Entity with Particle Program
        var ent = os.graphics.Managers.Entity.Create("particlePrg");
        ent.Graphics.Instanced = {};
        ent.Graphics.Instanced.position = [];
        ent.Graphics.Instanced.color = [];
        ent.Offset = [0,0,0];
        ent.Scale = [1,1,1];
        ent.Graphics.Set.rotation = function(rot){
            shd.Uniforms.get("uRMatrix").value = rot;
        }
        
        for(var i = 299; i >=0;  i--)
            ent.Graphics.Instanced.position.push(0);
            
        for(i = 399; i >= 0; i--)
            ent.Graphics.Instanced.color.push(0);
            
        
        //Creates Shader for Entity
                                        //shader name , program name
        var shd = ent.Graphics.Add.Shader("particleShd", "particlePrg");
                            
        //Add Attributes
        //shd.AddAttribute(shdVarName, shdDataType, jsBufferPointer, attributeType, itemSize);
        shd.AddAttribute("aVertexPosition", "FLOAT", null, "VERTEX", null);
        //shd.AddAttribute("aVertexNormal", "FLOAT", null, "NORMAL", null);
        shd.AddAttribute("aTextureCoord","FLOAT", null, "TEXTURE", null);
        shd.AddAttribute("aInstance", "FLOAT", null, "INSTANCE", null);                            

        //Add Uniforms to Entity
        shd.AddUniform("uWMatrix", "4X4", ent.Graphics.Matrix.World);
        shd.AddUniform("uRMatrix", "4X4", ent.Graphics.Matrix.Rotation);
        shd.AddUniform("uVMatrix", "4X4", os.graphics.Matrix.View);
        shd.AddUniform("uPMatrix", "4X4", os.graphics.Matrix.Projection);
        shd.AddUniform("uInstancePosition", "ARRAY_VEC3", ent.Graphics.Instanced.position);
        shd.AddUniform("uInstanceColor", "ARRAY_VEC4", ent.Graphics.Instanced.color);
        shd.AddUniform("uScale", "VEC3", ent.Scale);
        shd.AddUniform("uOffset", "VEC3", ent.Offset);
        return ent;
                            
    }
    
}

ParticleTest = function()
{
    
    var canvas = os.resschmgr.Create.HTMLElement("canvas");
    canvas.html().style.width = "100%";
    canvas.html().style.height = "100%";
    
    document.body.appendChild(canvas.html());
    document.body.style.overflow = "hidden";
    
    os.graphics.Load(true, true, canvas.html());
    os.graphics.Set.Callback.Draw(ParticleManager.Draw);
    os.graphics.Set.Callback.Update(ParticleManager.Update);    
    gl = os.graphics.gl;
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    Input = {
        Mouse: {
            lastX: 0,
            lastY: 0,
            pressed: false
        }
    }
    onKeyDown = function(e){
        if(String.fromCharCode(e.keyCode) == "W"){     //Forward
            os.graphics.Managers.Camera.MoveForward(10);   
        }
        else if(String.fromCharCode(e.keyCode) == "S"){     //Backware
            os.graphics.Managers.Camera.MoveBackward(10);
        }
        else if(String.fromCharCode(e.keyCode) == "A"){     //Straif Left
            os.graphics.Managers.Camera.MoveLeft(10);  
        }
        else if(String.fromCharCode(e.keyCode) == "D"){     //Straif Right
            os.graphics.Managers.Camera.MoveRight(10);
        }
        else if(String.fromCharCode(e.keyCode) == "Q"){     //Straif Up
            os.graphics.Managers.Camera.MoveUp(5);
        }
        else if(String.fromCharCode(e.keyCode) == "E"){     //Straif Down
            os.graphics.Managers.Camera.MoveDown(10);
        }
        else if(String.fromCharCode(e.keyCode) == "L"){     //Straif Down
            effect.Entity.Position[0] += .1;
        }
        else if(String.fromCharCode(e.keyCode) == "J"){     //Straif Down
            effect.Entity.Position[0] -= .1;
        }
        else if(String.fromCharCode(e.keyCode) == "I"){     //Straif Down
            effect.Entity.Position[1] += .1;
        }
        else if(String.fromCharCode(e.keyCode) == "K"){     //Straif Down
            effect.Entity.Position[1] -= .1;
        }
        else if(String.fromCharCode(e.keyCode) == "P"){     //Straif Down
            effect.Entity.roll -= 1;
        }
        else if(String.fromCharCode(e.keyCode) == "O"){     //Straif Down
            effect.Entity.pitch -= 1;
        }
        else if(String.fromCharCode(e.keyCode) == ";"){     //Straif Down
            effect.Entity.roll -= 1;
        }
        else if(String.fromCharCode(e.keyCode) == "X"){     //Straif Down
            
            ParticleManager.Start(explosion1.id);
        }
        else if(String.fromCharCode(e.keyCode) == "Z"){     //Straif Down
            
            ParticleManager.Start(explosion2.id);
        }
        
        
        
    }
    onMouseDown = function(e){
        Input.Mouse.lastX = e.clientX;
        Input.Mouse.lastY = e.clientY;
        Input.Mouse.pressed = true;
    }
    
    onMouseUp = function(e){
        Input.Mouse.pressed = false;
    }
    
    onMouseMove = function(e){
        if (!Input.Mouse.pressed) {
            return;
        }
        var cam = os.graphics.Managers.Camera;
        
        var newX = e.clientX;
        var newY = e.clientY;
    
        var deltaX = newX - Input.Mouse.lastX
        cam.Rotation.yaw += deltaX / 10;
        
        if(cam.Rotation.yaw > 360){ cam.Rotation.yaw  -= 360;}
        else if(cam.Rotation.yaw < 0) { cam.Rotation.yaw += 360; }
    
        var deltaY = newY - Input.Mouse.lastY;
        cam.Rotation.pitch += deltaY / 10;
        if(cam.Rotation.pitch > 360){ cam.Rotation.pitch  -= 360;}
        else if(cam.Rotation.pitch < 0) { cam.Rotation.pitch += 360; }
    
        Input.Mouse.lastX = newX
        Input.Mouse.lastY = newY;   
    }
    
    
    // Setup Event Handlers for User Input
    window.addEventListener("keydown", onKeyDown, false);
    os.graphics.Get.Canvas().addEventListener("mousedown", onMouseDown, false);
    document.addEventListener("mouseup", onMouseUp, false);
    document.addEventListener("mousemove", onMouseMove, false);
    
    os.console.Comment("test");
    ParticleManager.Initalize();
    //effect = ParticleManager.Create("thruster1");
    //effect.Entity.Position = [-20,0,0];
    //ParticleManager.Start(effect.id);
    
    explosion1 = ParticleManager.Create("explosion", [-10,0,0]);
    explosion1.Entity.Position = [-10,0,0];
            
    explosion2 = ParticleManager.Create("explosion");
    explosion2.Entity.Position = [10,0,0];
    
    os.graphics.Managers.Camera.Position[0] = 0;
    os.graphics.Managers.Camera.Position[1] = 0;
    os.graphics.Managers.Camera.Position[2] = -22;
    
    terrain = os.graphics.Managers.Entity.Create();
    terrain.Graphics.Add.Mesh("quad");
    terrain.Graphics.Set.light(false);
    terrain.Graphics.Set.useBlendColor(true);
    terrain.Graphics.Set.texture(false);
    terrain.Graphics.Set.blendColor([0.17,0.26,0.40]);
    terrain.Set.Scale(2000,2000,1);
    terrain.pitch = 90;
    terrain.Set.Position(0,0,0);
    terrain.Graphics.Set.fog(true);
    terrain.Graphics.Set.fogEndPosition(1000.0);
    terrain.Graphics.Set.fogBeginPosition(200.0);
    os.graphics.AddToWorld(terrain);
        
    os.graphics.Start();
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.enable(gl.BLEND);
}


/*
os = {
    kernel: {
        ResSchMgr: os.resschmgr,
        Command: os.command,
        Instruction: os.instruction,
        GetName: function(){},
        GetVersion: function(){},
        GetPath: function(){}
    },
    command: {
        GetName: function(){},
        GetVersion: function(){},
        GetPath: function(){}
    },
    resschmgr: {
        Create: {
            XHRObject: function(){
                return new CXHRObject();
            },
            Core: function(id){
                return new CCore(id);
            },
            Command: function(name, callback, scope, help){
                return new CCommand(name, callback, scope, help);
            },
            Event: function(id, target, name, eventType, custom, can_bubble, cancelable){
                return new CEvent(id, target, name, eventType, custom, can_bubble, cancelable);
            },
            EventObject:function(id, name, custom, targetID){
                return new CEventObject(id, name, custom, targetID);
            },
            Subscriber: function(name, id, eventName, callback, capture){
                return new CSubscriber(name, id, eventName, callback, capture);
            },
            Instruction: function(){
                return new CInstruction();
            },
            Map: function(linkEntries){
                return new CMap(linkEntries);
            },
            Queue: function(){
                return new CQueue();
            },
            Window: function(uID,uName, uWidth, uHeight, uTop, uLeft){
                return new CWindow(uID,uName, uWidth, uHeight, uTop, uLeft);
            },
            HTMLElement: function(tag){
                return new CHTMLElement(tag);
            },
            Entity: function(id){
                return new CEntity(id);   
            }
        },
        WindowManager: {
            
        },
        CoreManager: {
            
        },
        EventManager:{
            
        },
        ScheduleManager: {
            
        },
        GetName: function(){},
        GetVersion: function(){},
        GetPath: function(){}
    },
    instruction: null,
    
    //Internal Cores/APIs
    cores: {
        Network: os.network,
        Threads: os.threads,
        Windows: os.windows,
        Graphics: os.graphics,
        HTML: os.html,
        Database: os.datbase,
        Audio: os.audio
    },
    audio: {
        Add: function(sKey, sPath, bLoop, bAutoplay, sType){       
            return new CSound(key);  
        },
        Get: {
            Volume: function(sKey){
                return new CSound(key).volume;
            },
            Sound: function(sKey){
                return new CSound(key);
            },
            Duration: function(sKey){
                return new Number();
            }
            
        },
        Set: {
            Volume: function(sKey, vol){

            },
            CurrentTime: function(sKey, time){
                
            }
        },
        Play: function(sKey){
        },
        Pause: function(sKey){
        },
        GetName: function(){
            return NAME;
        },
        
        GetVersion: function(){
            return VERSION;
        },
        
        GetPath: function(){
            return PATH;
        },
       
        GetID: function(){
            return ID;
        },
        
        Initialize: function(){
            sounds = new os.resschmgr.Create.Map();   
        }
    },
    network: {
        GetName: function(){
        },
        
        GetVersion: function(){
        },
        
        GetPath: function(){
        },
        
        GetID: function(){
        },
        
             
        SocketManager:{
            Sockets: new CMap(),
            CreateSocket: function(domain,port,path){
                //Create new socket
                return new CWebSocket(domain, port, path, id);
            }
            
            
        },
        Create: {
            Socket: function(domain,port,path){
                //Create new socket
                return new CWebSocket(domain, port, path, id);
            },
            SocketIO: function(domain, port, path){
                //Create new socket
                return new CSocketIO(domain, port, path, id);
            },
            JOSServer: function(domain,port,path){
                return new CJOSServer();
            }
        }
    },
    threads: null,
    html: null,
    windows: {
        Create: {
            Window: function(wndTitle, themeName){
                return new CWindowCore(0, wndTitle, themeName);
            },
            ErrorWindow: function(wndTitle, message){
                    
            },
            Theme: function(name){
                return new CWindowTheme(name);
            },
            MenuElement: function(){
                return new CMenuElement();
            },
            ToolbarElement: function(){
                return new CToolbarElement();
            }
        },
        WindowsManager: {
            nextID: 0,
            Windows: new CMap(),
            Themes: new CMap(),
            BuildDefaultThemes: function(){

            },
            ActiveWindow: new CWindowCore(),
            Create: {
                Window: function(wndTitle, themeName){
                    return new CWindowCore(0, wndTitle, themeName);
                },
                Theme: function(name){
                    return new CWindowTheme(name);
                },
                MenuElement: function(){
                    return new CMenuElement();
                },
                ToolbarElement: function(){
                    return new CToolbarElement();
                }
                
            }
        },   
        Desktop: {
            Themes: new CMap(),
            Applications: new CMap(),
            nextID: 0,
            theme: new CWindowTheme(),
            Get: {
                state: {
                    desktop: function(){
                    },
                    dock: function(){
                    },
                    startButton: function(){
                    },
                    startButtonText: function(){
                    },
                    startMenu: function(){
                    }
                }
            },
            Create: {
                Theme: function(name){
                    return CDesktopTheme(name);
                },
                Application: function(){
                    return new CApplication(os.windows.Desktop.nextID++);
                }
            },
            Display: {
                desktop: function(){
                },
                dock: function(){
                },
                startButton: function(){
                },
                startButtonText: function(){
                },
                startMenu: function(){
                }
            },
            Hide: {
                desktop: function(){
                },
                dock: function(){
                },
                startButton: function(){
                },
                startButtonText: function(){
                },
                startMenu: function(){
                }
            },
            Set: {
    
            },
            
            AddApplication: function(cApplication){

            },
            RemoveApplication: function(){
                
            },
            LoadTheme: function(cTheme){

                
            },
            ClearTheme: function(){
            },
            Elements: {
                desktop: new CHTMLElement("div"),
                dock: new CHTMLElement("div"),
                startButton: new CHTMLElement("div"),
                startButtonText:new CHTMLElement("div"),
                startMenu: new CHTMLElement("div")
            },
            Load: function(sTheme){

            }
            
        },
        GetName: function(){
            return NAME;
        },
        
        GetVersion: function(){
            return VERSION;
        },
        
        GetPath: function(){
            return PATH;
        },
       
        GetID: function(){
            return ID;
        }
        
    },
    datbase: null,
    graphics: {
        gl: null,
        Managers: {
            Shader:{
                Maps: {
                    VertexShaders: new CMap(),
                    FragmentShaders: new CMap(),
                    Programs: new CMap()
                },
                Create: {
                    VertexShader: function(key, url){
                        return new CVertexShader(key, url);
                    },
                    FragmentShader: function(key, url){
                        return new CFragmentShader(key, url);
                    },
                    Program: function(sVS, sFS, key){
                        //Create Program
                        return new CProgram(sVS, sFS, key);  
                    },
                    Shader: function(cProg){
                        return  new CShader(cProg);
                    },
                    Uniform: function(shdVarName, shdVarType, jsVarPtr){
                        return new CUniform(shdVarName, shdVarType, jsVarPtr);
                    },
                    Attribute: function(shdVarName, shdDataType, attributeType){
                        return new CAttribute(shdVarName, shdDataType, attributeType);
                    }
                },
                SetActiveProgram: function(cPrg){
                },
                ActiveProgram: new CProgram()
            },
            Mesh:{
                meshes: new CMap(),
                totalPolys: 0,
                totalVerts: 0,
                Create: {
                    Mesh: function(key, url){
                        return new CMesh(key, url);
                    },
                    Primitive: {
                        Cube:   function(key){
                            return new CMesh(key);
                        },
                        Quad: function(key){
                            return new CMesh(key);
                        }
                    },
                    Instanced: function(sMesh, sKey, number){
                        return new CMesh(sKey);
                    }
                },
                
                GetMesh: function(key){
                    return new CMesh(key);
                }
                
            },
            Sprite:{
            },
            Texture:{
                textures: new CMap(),
                Create: {
                    Texture:   function(key, url){
                        return new CTexture(key, url);
                    },
                    CubeMap: function(key){
                        return new CCubeMap(key);
                    },
                    RenderTexture: function(sKey, iWidth, iHeight){
                        return new CRenderTexture(sKey, iWidth, iHeight);
                    }
                },
                GetTexture: function(key){
                   return new CTexture();
                }
            },
            Entity:{
                Entities: new CMap(),
                _count: 0,
                Create : function(sProgram, id){
                    return new CEntity();
                    
                },
                EnableGraphics: function(cEntity, program){
                    
                    return new CEntity();
                }
            },
            Camera:{
                Position: vec3.create([0,0,0]),
                Offset: vec3.create([0,0,0]),
                Attach: function(cEntity){

                },
                attached: false,
                attachedEntity: new CGraphicsEntity(),
                Rotation: {
                    yaw:   0,
                    pitch: 0,
                    roll:  0
                },
                LookAtPoint: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                Axis: {
                    Look:  vec3.create([0,0,-1]),
                    Right: vec3.create([1,0,0]),
                    Up:    vec3.create([0,1,0])
                },
                Matrix: {
                    Yaw:   mat4.create(),
                    Pitch: mat4.create(),
                    Roll:  mat4.create(),
                    Rotation: mat4.create(),
                    Translate: mat4.create()
                },
                MoveForward: function(distance){

                },
                MoveBackward: function(distance){

                },
                MoveLeft: function(distance){

                },
                MoveRight: function(distance){

                },
                MoveUp: function(distance){

                },
                MoveDown: function(distance){
       
                },
                CalculateViewMatrix: function(){
                    
                }
            }
        },
        Matrix: {
            Projection: mat4.create(),
            View: mat4.create()
        },
        Time: {
            current:    0,
            previous:   0,
            elapsed:    0,
            dt:         0
        },
        
        Get: {
            Canvas: function(){return _canvas;},
            Pause: function(){return _pause;},
            Fullscreen: function(){return _fullscreen;},
            Width: function(){return _width;},
            Height: function(){return _height;}
        },
        Set: {
            Callback:{
                Update: function(updateFunction, updateScope){
                    _update = updateFunction;
                    _updateScope = updateScope;
                },
                Draw: function(drawFunction, drawScope){
                    _draw = drawFunction;
                    _drawScope = drawScope;
                },
                Reset: function(resetFunction, resetScope){
                    _reset = resetFunction;
                    _resetScope = resetScope;
                }
                
            }
        },
        Maps: {
            update: new CMap(),
            draw: new CMap(),
            name2id: new CMap()
        },
        
        //PUBLIC PRIVILEDGE METHODS
        Initialize: function(){

        },
        Load: function(isDebug, isFullscreen, canvas){
            return document.createElement("canvas");
            
        },
        Start: function(){
        },
        Pause: function(){
        },
        Resume: function(){
        },            
        Update: function(){

        },
        Draw: function(){

        },
        AddToWorld: function(cEntity){
        },
        AddToDraw: function(cEntity){
        },
        AddToUpdate: function(cEntity){
        },
        RemoveFromWorld: function(cEntity){
        },
        RemoveFromDraw: function(cEntity){
        },
        RemoveFromUpdate: function(cEntity){
        },
        OnReset: function(){
            
        },
        
        GetName: function(){
            return NAME;
        },
        
        GetVersion: function(){
            return VERSION;
        },
        
        GetPath: function(){
            return PATH;
        },
       
        GetID: function(){
            return ID;
        } 
        
    
    },
    
    //UTILITIES MODULE
    utilities: {
        console: os.console,
        deubugbar: os.debugbar,
        timeer: os.timer,
        GetName: function(){},
        GetVersion: function(){},
        GetPath: function(){}
    },
    console: {
        cmdWindow: document.createElement("textarea"),
        length: 0,
        Pinned: false,
        ConsoleHover: false,
        APIPinned: false,
        APIHover: false,
        Commands: new CMap(),
        AddCommand: function(name, callback, scope, help){
        },
        
        RemoveCommand: function(name){
        },
        
        GetCommand: function(name){
        },
        
        DisplayCommands: function(){
            
        },
        AppendComment: function(comment){
                                        
        },
       
        Comment: function(comment){
                                      
        },
        
        Warning: function(comment){
                                       
        },
        
        Error: function(comment){
                                       
        },
        
        Clear: function(){
                                     
        },
        GetName: function(){},
        GetVersion: function(){},
        GetPath: function(){},
        GetStatus: function(){
        },
        GetPrompt: function(){
        },
        Enable: function(){
        },
        
        Disable: function(){
        }
                                    
                                    
    },
    debugbar: {
        //PUBLIC ATTRIBUTES
        ConsolePagePinned: false,
        LogsPagePinned: false,
        SettingsPagePinned: false,
        GetName: function(){
            return NAME;
        },
        
        GetVersion: function(){
            return VERSION;
        },
        
        GetPath: function(){
            return PATH;
        },
        
        GetStatus: function(){
            return ENABLED;
        },
        
        Enable: function(){
             
        },
        
        Disable: function(){ 
        },        
        Build: function(){

        },
        
        //******************************************
        //
        //  SIDEBAR PIN FUNCTIONS
        //
        //******************************************
        AnchorPage: function(e){

        },
        AnchorConsolePage: function(e){

        },
        AnchorLogsPage: function(e){

        },
        AnchorSettingsPage: function(e){

        },
        
        EvaluateShortCuts:function(e){

        }

    },
    timer: {
        GetName: function(){},
        GetVersion: function(){},
        GetPath: function(){}
    },
    GetName: function(){},
    GetVersion: function(){},
    GetPath: function(){},
    GetDomain: function(){},
    Load: function(sAppName){
    },
    GetQueryString: function(){
        
    },
    ExecuteQuery: function(){

    },
    queryString: "",
    
    //PUBLIC OBJECTS/CLASSES
    Kernel: os.kernel,
    Cores: os.cores,

}*/