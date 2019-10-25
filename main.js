var canvas = document.getElementsByTagName('canvas')[0];
canvas.width = innerWidth;
canvas.height = innerHeight;
var c = canvas.getContext('2d');
c.fillRect(0,0,canvas.width,canvas.height);

var canvas2 = document.getElementsByTagName('canvas')[1];
canvas2.width = innerWidth;
canvas2.height = innerHeight;
var c2 = canvas2.getContext('2d');

var g = 0.1;
var ids = 0;

var settings =
{
  high:
  {
    fireworkInterval: 20,
    particlesBase: 110,
    particlesRare: 30,
    particlesSubRare: 20,
  },
  medium:
  {
    fireworkInterval: 40,
    particlesBase: 80,
    particlesRare: 20,
    particlesSubRare: 15,
  },
  low:
  {
    fireworkInterval: 60,
    particlesBase: 50,
    particlesRare: 10,
    particlesSubRare: 10,
  }
};

var set = settings.medium;
var rare = true;
var trail = 0.25;
var audio = false;

function changeSettings(x)
{
  if(x)
  {
    set = settings[x];
    document.getElementById("high").style.textDecoration = "none";
    document.getElementById("medium").style.textDecoration = "none";
    document.getElementById("low").style.textDecoration = "none";
    document.getElementById(x).style.textDecoration = "underline";
  }
  rare = document.getElementById("rare").checked;
  audio = document.getElementById("audio").checked;
  if(document.getElementById("trail").checked){trail = 0.25;}else{trail = 1;}
}

class Firework
{
  constructor(id,x,y,angle,force,color,timer,width,exX,exY,rain)
  {
    this.id = id;
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.force = force;
    this.spdX = Math.cos(this.angle/180*Math.PI)*this.force;
    this.spdY = Math.sin(this.angle/180*Math.PI)*this.force;
    this.color = color;
    this.timer = timer;
    this.width = width;
    if(rain)this.rare = true;
    else if(rare && Math.random()<0.02 && this.width==8)this.rare = true;
    else this.rare = false;
    this.dead = false;
    if(this.rare)this.width = 12;
    if(this.width <= 6)
    {
      this.spdY -= 2;
      this.spdY += exY/5;
      this.spdX += exX/5;
    }
  }

  update()
  {
    if(!this.dead)
    {
      if(this.rare)this.color+=10;
      c.beginPath();
      c.arc(this.x,this.y,this.width/2,0,Math.PI*2);
      c.fillStyle = "hsl("+this.color+",100%,50%)";
      c.fill();
      c.strokeStyle = "hsl("+this.color+",100%,50%)";
      c.beginPath();
      c.moveTo(this.x,this.y);
      this.spdY += g;
      this.x += this.spdX;
      this.y += this.spdY;
      c.lineTo(this.x,this.y);
      c.lineWidth = this.width;
      c.stroke();
      c.beginPath();
      c.arc(this.x,this.y,this.width/2,0,Math.PI*2);
      c.fillStyle = "hsl("+this.color+",100%,50%)";
      c.fill();
      this.timer--;
      if(this.width <= 0.1){this.width = 0; this.dead = true;}
      else if(this.width <= 4){this.width-=0.05;}
      if(this.y>innerHeight)
      {
        this.dead = true;
      }
      if(this.timer==0)
      {
        booms.push(new Boom(booms.length,this.x,this.y,this.color));
        if(this.rare)
        {
          this.n = set.particlesRare;
          for(let i=0;i<this.n;i++)
          {
            fireworks.push(new Firework(fireworks.length,this.x,this.y,Math.random()*360,Math.random()*3,Math.random()*360,parseInt(Math.random()*15+40),this.width/2,this.spdX,this.spdY));
          }
          if(audio)
          {
            var sfx = document.createElement("AUDIO");
            sfx.innerHTML = '<source src="boom.mp3" type="audio/mp3">';
            sfx.play();
          }
        }
        else if(this.width == 6)
        {
          this.n = set.particlesSubRare;
          for(let i=0;i<this.n;i++)
          {
            fireworks.push(new Firework(fireworks.length,this.x,this.y,Math.random()*360,Math.random()*3,this.color,-1,this.width/2,this.spdX,this.spdY));
          }
          if(audio)
          {
            var sfx = document.createElement("AUDIO");
            sfx.innerHTML = '<source src="boom.mp3" type="audio/mp3">';
            sfx.volume = 0.05;
            sfx.play();
          }
        }
        else
        {
          this.n = set.particlesBase;
          if(cannon.ring == "yes")
          {
            for(let i=0;i<this.n;i++)fireworks.push(new Firework(fireworks.length,this.x,this.y,Math.random()*360,Math.random()*0.5+2.5,this.color,-1,this.width/2,this.spdX,this.spdY));
          }
          else if(cannon.ring == "no")
          {
            for(let i=0;i<this.n;i++)fireworks.push(new Firework(fireworks.length,this.x,this.y,Math.random()*360,Math.random()*3,this.color,-1,this.width/2,this.spdX,this.spdY));
          }
          else if(Math.random()<0.25)
          {
            for(let i=0;i<this.n;i++)fireworks.push(new Firework(fireworks.length,this.x,this.y,Math.random()*360,Math.random()*0.5+2.5,this.color,-1,this.width/2,this.spdX,this.spdY));
          }
          else
          {
            for(let i=0;i<this.n;i++)fireworks.push(new Firework(fireworks.length,this.x,this.y,Math.random()*360,Math.random()*3,this.color,-1,this.width/2,this.spdX,this.spdY));
          }
          if(audio)
          {
            var sfx = document.createElement("AUDIO");
            sfx.innerHTML = '<source src="boom.mp3" type="audio/mp3">';
            sfx.volume = 0.3;
            sfx.play();
          }
        }
        this.timer--;
        this.dead = true;
      }
    }
  }
}

class Boom
{
  constructor(id,x,y,color)
  {
    this.x = x;
    this.y = y;
    this.color = color;
    this.a = 30; //alpha
    this.r = 0; //radius
  }

  update()
  {
    this.r+=10;
    this.a-=2;
    c.beginPath();
    c.arc(this.x,this.y,this.r,0,Math.PI*2);
    c.fillStyle = "hsl("+this.color+",100%,"+this.a+"%)";
    c.fill();
    if(this.a<0){booms.splice(this.id,1,);}
  }
}

var cannon =
{
  x: innerWidth/2,
  spdL: 0,
  spdR: 0,
  spd: 0,
  angle: 270,
  targetX: innerWidth/2,
  targetY: 0,
  color: "random",
  force: 12,
  ring: "random",

  update: function()
  {
    this.spd = this.spdL + this.spdR;
    this.x += this.spd;
    if(this.x<0)this.x=0;
    if(this.x>innerWidth)this.x=innerWidth;
    this.angle = Math.atan2(this.targetY-innerHeight-6, this.targetX-this.x)*180/Math.PI;
  },

  draw: function()
  {
    c2.clearRect(0,0,innerWidth,innerHeight);
    c2.beginPath();
    c2.arc(this.x,innerHeight-6,20,0,Math.PI*2);
    c2.fillStyle = "#AAAAAA";
    c2.fill();
    c2.beginPath();
    c2.arc(this.x-20,innerHeight-6,6,0,Math.PI*2);
    c2.fillStyle = "#AAAAAA";
    c2.fill();
    c2.beginPath();
    c2.arc(this.x+20,innerHeight-6,6,0,Math.PI*2);
    c2.fillStyle = "#AAAAAA";
    c2.fill();
    c2.beginPath();
    c2.moveTo(this.x,innerHeight-6);
    c2.lineTo(this.x+Math.cos(this.angle*Math.PI/180)*40,innerHeight+Math.sin(this.angle*Math.PI/180)*40);
    c2.lineWidth = 5;
    c2.strokeStyle = "#AAAAAA";
    c2.stroke();
  }
}

window.addEventListener('keydown',function(e)
{
  if(e.keyCode == "65" || e.keyCode == "37")cannon.spdL = -5;
  if(e.keyCode == "68" || e.keyCode == "39")cannon.spdR = 5;
  if(e.keyCode == "49")cannon.color = 0;
  if(e.keyCode == "50")cannon.color = 60;
  if(e.keyCode == "51")cannon.color = 120;
  if(e.keyCode == "52")cannon.color = 180;
  if(e.keyCode == "53")cannon.color = 240;
  if(e.keyCode == "54")cannon.color = 300;
  if(e.keyCode == "55")cannon.color = "random";
  if(e.keyCode == "56")cannon.color = "rainbow";
  if(e.keyCode == "81")cannon.ring = "yes";
  if(e.keyCode == "87")cannon.ring = "no";
  if(e.keyCode == "69")cannon.ring = "random";
  if(e.keyCode == "189")cannon.force--;
  if(e.keyCode == "187")cannon.force++;
  if(e.keyCode == "67")clean();
});

window.addEventListener('keyup',function(e)
{
  if(e.keyCode == "65" || e.keyCode == "37")cannon.spdL = 0;
  if(e.keyCode == "68" || e.keyCode == "39")cannon.spdR = 0;
});

window.addEventListener('mousemove',function(e)
{
  cannon.targetX = e.clientX;
  cannon.targetY = e.clientY;
});

canvas2.addEventListener('mousedown',function(e)
{
  let clr, rain;
  if(cannon.color == "random" || cannon.color == "rainbow")clr = Math.random()*360;
  else clr = cannon.color;
  if(cannon.color == "rainbow")rain = true;

  fireworks.push(new Firework(fireworks.length,cannon.x+cannon.spd*4.7,innerHeight,cannon.angle,cannon.force,clr,80,8,0,0,rain));
});

var fireworks = [];
var booms = [];

function clean()
{
  fireworks = [];
  c.fillStyle = "black";
  c.fillRect(0,0,canvas.width,canvas.height);
}

function animate()
{
  cannon.update();
  cannon.draw();
  c.fillStyle = "rgba(0,0,0,"+trail+")";
  c.fillRect(0,0,canvas.width,canvas.height);
  for(let i=0;i<booms.length;i++)
  {
    booms[i].update();
  }
  for(let i=0;i<fireworks.length;i++)
  {
    fireworks[i].update();
  }
  window.requestAnimationFrame(animate);
}
animate();
