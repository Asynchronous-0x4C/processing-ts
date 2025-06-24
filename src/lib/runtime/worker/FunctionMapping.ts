export const function_mapping:Record<string,number>={init:1,noFill:10,fill:11,noStroke:12,stroke:13,strokeWeight:14,rectMode:20,ellipseMode:21,background:30,rect:31,quad:32,ellipse:33,circle:34,triangle:35,arc:36,line:37,point:38,text:50,textAlign:51,textSize:52,translate:100,setCursor:1000,showCursor:1001,hideCursor:1002};

export const function_mapping_reverse=Object.keys(function_mapping).reduce((acc, name) => {
  acc[function_mapping[name]] = name;
  return acc;
}, {} as Record<number, string>);