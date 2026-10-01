export const WORLD_WIDTH = 11200;
export const WORLD_HEIGHT = 1000;
export const GROUND_Y = 600;
export const zones = [
  {id:'start',label:'System start',short:'Start',start:0,end:650},
  {id:'about',label:'Identity record',short:'About',start:650,end:1550},
  {id:'projects',label:'Project zone',short:'Projects',start:1550,end:4450},
  {id:'ai',label:'AI / Experiments',short:'AI',start:4450,end:5700},
  {id:'experience',label:'Experience archive',short:'Experience',start:5700,end:6900},
  {id:'skills',label:'System capabilities',short:'Skills',start:6900,end:8400},
  {id:'resume',label:'Resume archive',short:'Resume',start:8400,end:9550},
  {id:'contact',label:'Communication node',short:'Contact',start:9550,end:WORLD_WIDTH}
];
const block = (id,x,width,label,subtitle,type=id,contentId=id,y=340,height=110) => ({id,x,y,width,height,label,subtitle,type,contentId,radius:210,hitAt:-100});
export function createWorld() {
  const blocks = [
    block('about',820,340,'ABOUT','IDENTITY FILE'),
    block('projects',1740,420,'PROJECTS','4 SYSTEMS'),
    block('morrowlab',2350,340,'MorrowLab','CORE DEVELOPER · MODULE 01','project','morrowlab',365,85),
    block('dashboard',2800,340,'Morning Dashboard','WEB PROJECT · MODULE 02','project','dashboard',370,80),
    block('security',3250,340,'Cybersecurity Game','PYTHON · MODULE 03','project','security',370,80),
    block('detection',3700,340,'Object Detection','COMPUTER VISION · MODULE 04','project','detection',370,80),
    block('ai',4780,420,'AI / EXPERIMENTS','COMPUTER VISION'),
    block('experience',6000,440,'EXPERIENCE','ROBOTICS · LEADERSHIP'),
    block('skills',7730,360,'SKILLS','SYSTEM CAPABILITIES'),
    block('resume',8660,440,'RESUME','PERSONNEL FILE'),
    block('contact',9830,420,'CONTACT','COMMUNICATION NODE'),
    block('terminal',520,150,'TERMINAL','OPTIONAL CONSOLE','terminal','terminal',400,50),
    block('end',10720,300,'THANKS FOR EXPLORING','JUNYOUNG OH','end','end',355,95)
  ];
  const platforms = [
    {x:6970,y:520,width:180,height:18,label:'JAVA'},
    {x:7190,y:445,width:180,height:18,label:'PYTHON'},
    {x:7420,y:500,width:210,height:18,label:'JAVASCRIPT'},
    {x:8120,y:515,width:180,height:18,label:'TYPESCRIPT'}
  ];
  const floor = {x:0,y:GROUND_Y,width:WORLD_WIDTH,height:400};
  return {width:WORLD_WIDTH,height:WORLD_HEIGHT,ground:GROUND_Y,blocks,platforms,solids:[floor,...platforms,...blocks],checkpoint:{x:180,y:GROUND_Y-60},time:0};
}
export function zoneAt(x) { return zones.find(zone => x >= zone.start && x < zone.end) || zones.at(-1); }
