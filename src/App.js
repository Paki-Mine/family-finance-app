import React, { useState, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DATI DEMO — tutti i dati reali sono stati sostituiti con dati fittizi
// ─────────────────────────────────────────────────────────────────────────────
const INIT_MEMBERS = [{ id:"1", name:"La mia famiglia", avatar:"👨\u200d👩\u200d👧\u200d👦", color:"#7c6af7" }];

const INIT_CATEGORIES = {
  out: [
    { id:"co0",  name:"Casa",          icon:"🏠", color:"#7c6af7" },
    { id:"co1",  name:"Alimentari",    icon:"🛒", color:"#4ade80" },
    { id:"co2",  name:"Trasporti",     icon:"🚗", color:"#f87171" },
    { id:"co3",  name:"Salute",        icon:"💊", color:"#fbbf24" },
    { id:"co4",  name:"Svago",         icon:"🎮", color:"#38bdf8" },
    { id:"co5",  name:"Abbigliamento", icon:"👕", color:"#fb7185" },
    { id:"co6",  name:"Istruzione",    icon:"📚", color:"#a78bfa" },
    { id:"co7",  name:"Risparmi",      icon:"🏦", color:"#34d399" },
    { id:"co8",  name:"Figli",         icon:"👶", color:"#f59e0b" },
    { id:"co9",  name:"Sport",         icon:"⚽", color:"#60a5fa" },
    { id:"co10", name:"Altro",         icon:"📦", color:"#e879f9" },
    { id:"co11", name:"Ristoranti/Delivery/Bar", icon:"🍽️", color:"#f97316" },
  ],
  in: [
    { id:"ci0", name:"Stipendio",    icon:"💼", color:"#a78bfa" },
    { id:"ci1", name:"Freelance",    icon:"💻", color:"#34d399" },
    { id:"ci2", name:"Investimenti", icon:"📈", color:"#f59e0b" },
    { id:"ci3", name:"Bonus",        icon:"🎁", color:"#60a5fa" },
    { id:"ci4", name:"Altro",        icon:"📥", color:"#e879f9" },
  ],
};

// Spese ricorrenti demo
const INIT_RECURRING = [
  { id:"r1", name:"Mutuo",            amount:500, categoryId:"co0", memberId:"1", active:true },
  { id:"r2", name:"Telefonia",        amount:15,  categoryId:"co0", memberId:"1", active:true },
  { id:"r3", name:"Internet",         amount:30,  categoryId:"co0", memberId:"1", active:true },
  { id:"r4", name:"Netflix/Spotify",  amount:22,  categoryId:"co4", memberId:"1", active:true },
  { id:"r5", name:"Palestra",         amount:45,  categoryId:"co9", memberId:"1", active:true },
  { id:"r6", name:"Assicurazione vita",amount:35, categoryId:"co3", memberId:"1", active:true },
];

// Dati demo (2023-2026) — nessun dato personale reale
const HISTORICAL_TRANSACTIONS = [{"id":"d1000","type":"in","amount":1540.0,"categoryId":"ci0","note":"Stipendio","date":"2023-01-01","memberId":"1"},{"id":"d1001","type":"in","amount":1066.0,"categoryId":"ci0","note":"Stipendio partner","date":"2023-01-01","memberId":"1"},{"id":"d1002","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2023-01-01","memberId":"1"},{"id":"d1003","type":"out","amount":98.0,"categoryId":"co0","note":"Luce","date":"2023-01-01","memberId":"1"},{"id":"d1004","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2023-01-01","memberId":"1"},{"id":"d1005","type":"out","amount":351.0,"categoryId":"co1","note":"Prodotti casa","date":"2023-01-01","memberId":"1"},{"id":"d1006","type":"out","amount":113.0,"categoryId":"co2","note":"Assicurazione auto","date":"2023-01-01","memberId":"1"},{"id":"d1007","type":"out","amount":161.0,"categoryId":"co11","note":"Pizza","date":"2023-01-01","memberId":"1"},{"id":"d1008","type":"out","amount":149.0,"categoryId":"co3","note":"Dentista","date":"2023-01-01","memberId":"1"},{"id":"d1009","type":"out","amount":75.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2023-01-01","memberId":"1"},{"id":"d1010","type":"out","amount":49.0,"categoryId":"co5","note":"Abbigliamento","date":"2023-01-01","memberId":"1"},{"id":"d1011","type":"out","amount":411.0,"categoryId":"co10","note":"Viaggio natalizio","date":"2023-01-01","memberId":"1"},{"id":"d1012","type":"in","amount":1539.0,"categoryId":"ci0","note":"Stipendio","date":"2023-02-01","memberId":"1"},{"id":"d1013","type":"in","amount":1201.0,"categoryId":"ci0","note":"Stipendio partner","date":"2023-02-01","memberId":"1"},{"id":"d1014","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2023-02-01","memberId":"1"},{"id":"d1015","type":"out","amount":143.0,"categoryId":"co0","note":"Luce","date":"2023-02-01","memberId":"1"},{"id":"d1016","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2023-02-01","memberId":"1"},{"id":"d1017","type":"out","amount":337.0,"categoryId":"co1","note":"Supermercato","date":"2023-02-01","memberId":"1"},{"id":"d1018","type":"out","amount":132.0,"categoryId":"co2","note":"Benzina","date":"2023-02-01","memberId":"1"},{"id":"d1019","type":"out","amount":178.0,"categoryId":"co11","note":"Pranzo lavoro","date":"2023-02-01","memberId":"1"},{"id":"d1020","type":"out","amount":56.0,"categoryId":"co4","note":"Spotify","date":"2023-02-01","memberId":"1"},{"id":"d1021","type":"out","amount":118.0,"categoryId":"co5","note":"Abbigliamento","date":"2023-02-01","memberId":"1"},{"id":"d1022","type":"in","amount":1402.0,"categoryId":"ci0","note":"Stipendio","date":"2023-03-01","memberId":"1"},{"id":"d1023","type":"in","amount":1103.0,"categoryId":"ci0","note":"Stipendio partner","date":"2023-03-01","memberId":"1"},{"id":"d1024","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2023-03-01","memberId":"1"},{"id":"d1025","type":"out","amount":100.0,"categoryId":"co0","note":"Luce","date":"2023-03-01","memberId":"1"},{"id":"d1026","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2023-03-01","memberId":"1"},{"id":"d1027","type":"out","amount":445.0,"categoryId":"co1","note":"Supermercato","date":"2023-03-01","memberId":"1"},{"id":"d1028","type":"out","amount":132.0,"categoryId":"co2","note":"Assicurazione auto","date":"2023-03-01","memberId":"1"},{"id":"d1029","type":"out","amount":106.0,"categoryId":"co11","note":"Cena fuori","date":"2023-03-01","memberId":"1"},{"id":"d1030","type":"out","amount":159.0,"categoryId":"co5","note":"Abbigliamento","date":"2023-03-01","memberId":"1"},{"id":"d1031","type":"in","amount":1463.0,"categoryId":"ci0","note":"Stipendio","date":"2023-04-01","memberId":"1"},{"id":"d1032","type":"in","amount":1217.0,"categoryId":"ci0","note":"Stipendio partner","date":"2023-04-01","memberId":"1"},{"id":"d1033","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2023-04-01","memberId":"1"},{"id":"d1034","type":"out","amount":162.0,"categoryId":"co0","note":"Luce","date":"2023-04-01","memberId":"1"},{"id":"d1035","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2023-04-01","memberId":"1"},{"id":"d1036","type":"out","amount":480.0,"categoryId":"co1","note":"Prodotti casa","date":"2023-04-01","memberId":"1"},{"id":"d1037","type":"out","amount":94.0,"categoryId":"co2","note":"Bollo auto","date":"2023-04-01","memberId":"1"},{"id":"d1038","type":"out","amount":188.0,"categoryId":"co11","note":"Aperitivo","date":"2023-04-01","memberId":"1"},{"id":"d1039","type":"out","amount":133.0,"categoryId":"co3","note":"Parrucchiere","date":"2023-04-01","memberId":"1"},{"id":"d1040","type":"out","amount":33.0,"categoryId":"co4","note":"Cinema","date":"2023-04-01","memberId":"1"},{"id":"d1041","type":"out","amount":70.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2023-04-01","memberId":"1"},{"id":"d1042","type":"out","amount":129.0,"categoryId":"co5","note":"Abbigliamento","date":"2023-04-01","memberId":"1"},{"id":"d1043","type":"in","amount":1472.0,"categoryId":"ci0","note":"Stipendio","date":"2023-05-01","memberId":"1"},{"id":"d1044","type":"in","amount":1105.0,"categoryId":"ci0","note":"Stipendio partner","date":"2023-05-01","memberId":"1"},{"id":"d1045","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2023-05-01","memberId":"1"},{"id":"d1046","type":"out","amount":151.0,"categoryId":"co0","note":"Luce","date":"2023-05-01","memberId":"1"},{"id":"d1047","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2023-05-01","memberId":"1"},{"id":"d1048","type":"out","amount":419.0,"categoryId":"co1","note":"Supermercato","date":"2023-05-01","memberId":"1"},{"id":"d1049","type":"out","amount":96.0,"categoryId":"co2","note":"Bollo auto","date":"2023-05-01","memberId":"1"},{"id":"d1050","type":"out","amount":198.0,"categoryId":"co11","note":"Aperitivo","date":"2023-05-01","memberId":"1"},{"id":"d1051","type":"out","amount":31.0,"categoryId":"co3","note":"Visita medica","date":"2023-05-01","memberId":"1"},{"id":"d1052","type":"out","amount":39.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2023-05-01","memberId":"1"},{"id":"d1053","type":"in","amount":1420.0,"categoryId":"ci0","note":"Stipendio","date":"2023-06-01","memberId":"1"},{"id":"d1054","type":"in","amount":1109.0,"categoryId":"ci0","note":"Stipendio partner","date":"2023-06-01","memberId":"1"},{"id":"d1055","type":"in","amount":441.0,"categoryId":"ci1","note":"Progetto extra","date":"2023-06-01","memberId":"1"},{"id":"d1056","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2023-06-01","memberId":"1"},{"id":"d1057","type":"out","amount":90.0,"categoryId":"co0","note":"Luce","date":"2023-06-01","memberId":"1"},{"id":"d1058","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2023-06-01","memberId":"1"},{"id":"d1059","type":"out","amount":477.0,"categoryId":"co1","note":"Prodotti casa","date":"2023-06-01","memberId":"1"},{"id":"d1060","type":"out","amount":113.0,"categoryId":"co2","note":"Tagliando","date":"2023-06-01","memberId":"1"},{"id":"d1061","type":"out","amount":147.0,"categoryId":"co11","note":"Pizza","date":"2023-06-01","memberId":"1"},{"id":"d1062","type":"out","amount":14.0,"categoryId":"co4","note":"Amazon Prime","date":"2023-06-01","memberId":"1"},{"id":"d1063","type":"out","amount":38.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2023-06-01","memberId":"1"},{"id":"d1064","type":"in","amount":1428.0,"categoryId":"ci0","note":"Stipendio","date":"2023-07-01","memberId":"1"},{"id":"d1065","type":"in","amount":1154.0,"categoryId":"ci0","note":"Stipendio partner","date":"2023-07-01","memberId":"1"},{"id":"d1066","type":"in","amount":350.0,"categoryId":"ci1","note":"Progetto extra","date":"2023-07-01","memberId":"1"},{"id":"d1067","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2023-07-01","memberId":"1"},{"id":"d1068","type":"out","amount":160.0,"categoryId":"co0","note":"Luce","date":"2023-07-01","memberId":"1"},{"id":"d1069","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2023-07-01","memberId":"1"},{"id":"d1070","type":"out","amount":399.0,"categoryId":"co1","note":"Supermercato","date":"2023-07-01","memberId":"1"},{"id":"d1071","type":"out","amount":145.0,"categoryId":"co2","note":"Assicurazione auto","date":"2023-07-01","memberId":"1"},{"id":"d1072","type":"out","amount":120.0,"categoryId":"co11","note":"Pranzo lavoro","date":"2023-07-01","memberId":"1"},{"id":"d1073","type":"out","amount":73.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2023-07-01","memberId":"1"},{"id":"d1074","type":"out","amount":275.0,"categoryId":"co10","note":"Vacanza","date":"2023-07-01","memberId":"1"},{"id":"d1075","type":"in","amount":1360.0,"categoryId":"ci0","note":"Stipendio","date":"2023-08-01","memberId":"1"},{"id":"d1076","type":"in","amount":1078.0,"categoryId":"ci0","note":"Stipendio partner","date":"2023-08-01","memberId":"1"},{"id":"d1077","type":"in","amount":365.0,"categoryId":"ci1","note":"Progetto extra","date":"2023-08-01","memberId":"1"},{"id":"d1078","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2023-08-01","memberId":"1"},{"id":"d1079","type":"out","amount":176.0,"categoryId":"co0","note":"Luce","date":"2023-08-01","memberId":"1"},{"id":"d1080","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2023-08-01","memberId":"1"},{"id":"d1081","type":"out","amount":462.0,"categoryId":"co1","note":"Spesa settimanale","date":"2023-08-01","memberId":"1"},{"id":"d1082","type":"out","amount":144.0,"categoryId":"co2","note":"Assicurazione auto","date":"2023-08-01","memberId":"1"},{"id":"d1083","type":"out","amount":110.0,"categoryId":"co11","note":"Pizza","date":"2023-08-01","memberId":"1"},{"id":"d1084","type":"out","amount":57.0,"categoryId":"co3","note":"Medicinali","date":"2023-08-01","memberId":"1"},{"id":"d1085","type":"out","amount":49.0,"categoryId":"co4","note":"Netflix","date":"2023-08-01","memberId":"1"},{"id":"d1086","type":"out","amount":230.0,"categoryId":"co10","note":"Vacanza","date":"2023-08-01","memberId":"1"},{"id":"d1087","type":"in","amount":1355.0,"categoryId":"ci0","note":"Stipendio","date":"2023-09-01","memberId":"1"},{"id":"d1088","type":"in","amount":1163.0,"categoryId":"ci0","note":"Stipendio partner","date":"2023-09-01","memberId":"1"},{"id":"d1089","type":"in","amount":472.0,"categoryId":"ci3","note":"Bonus trimestrale","date":"2023-09-01","memberId":"1"},{"id":"d1090","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2023-09-01","memberId":"1"},{"id":"d1091","type":"out","amount":60.0,"categoryId":"co0","note":"Luce","date":"2023-09-01","memberId":"1"},{"id":"d1092","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2023-09-01","memberId":"1"},{"id":"d1093","type":"out","amount":331.0,"categoryId":"co1","note":"Spesa biologica","date":"2023-09-01","memberId":"1"},{"id":"d1094","type":"out","amount":83.0,"categoryId":"co2","note":"Assicurazione auto","date":"2023-09-01","memberId":"1"},{"id":"d1095","type":"out","amount":87.0,"categoryId":"co11","note":"Cena fuori","date":"2023-09-01","memberId":"1"},{"id":"d1096","type":"out","amount":43.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2023-09-01","memberId":"1"},{"id":"d1097","type":"in","amount":1397.0,"categoryId":"ci0","note":"Stipendio","date":"2023-10-01","memberId":"1"},{"id":"d1098","type":"in","amount":1138.0,"categoryId":"ci0","note":"Stipendio partner","date":"2023-10-01","memberId":"1"},{"id":"d1099","type":"in","amount":429.0,"categoryId":"ci2","note":"Rendita investimento","date":"2023-10-01","memberId":"1"},{"id":"d1100","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2023-10-01","memberId":"1"},{"id":"d1101","type":"out","amount":153.0,"categoryId":"co0","note":"Luce","date":"2023-10-01","memberId":"1"},{"id":"d1102","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2023-10-01","memberId":"1"},{"id":"d1103","type":"out","amount":416.0,"categoryId":"co1","note":"Prodotti casa","date":"2023-10-01","memberId":"1"},{"id":"d1104","type":"out","amount":107.0,"categoryId":"co2","note":"Tagliando","date":"2023-10-01","memberId":"1"},{"id":"d1105","type":"out","amount":155.0,"categoryId":"co11","note":"Pizza","date":"2023-10-01","memberId":"1"},{"id":"d1106","type":"out","amount":43.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2023-10-01","memberId":"1"},{"id":"d1107","type":"out","amount":131.0,"categoryId":"co5","note":"Abbigliamento","date":"2023-10-01","memberId":"1"},{"id":"d1108","type":"in","amount":1400.0,"categoryId":"ci0","note":"Stipendio","date":"2023-11-01","memberId":"1"},{"id":"d1109","type":"in","amount":1212.0,"categoryId":"ci0","note":"Stipendio partner","date":"2023-11-01","memberId":"1"},{"id":"d1110","type":"in","amount":165.0,"categoryId":"ci2","note":"Rendita investimento","date":"2023-11-01","memberId":"1"},{"id":"d1111","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2023-11-01","memberId":"1"},{"id":"d1112","type":"out","amount":75.0,"categoryId":"co0","note":"Luce","date":"2023-11-01","memberId":"1"},{"id":"d1113","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2023-11-01","memberId":"1"},{"id":"d1114","type":"out","amount":385.0,"categoryId":"co1","note":"Spesa settimanale","date":"2023-11-01","memberId":"1"},{"id":"d1115","type":"out","amount":108.0,"categoryId":"co2","note":"Tagliando","date":"2023-11-01","memberId":"1"},{"id":"d1116","type":"out","amount":164.0,"categoryId":"co11","note":"Cena fuori","date":"2023-11-01","memberId":"1"},{"id":"d1117","type":"out","amount":133.0,"categoryId":"co3","note":"Dentista","date":"2023-11-01","memberId":"1"},{"id":"d1118","type":"out","amount":13.0,"categoryId":"co4","note":"Cinema","date":"2023-11-01","memberId":"1"},{"id":"d1119","type":"out","amount":62.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2023-11-01","memberId":"1"},{"id":"d1120","type":"out","amount":95.0,"categoryId":"co5","note":"Abbigliamento","date":"2023-11-01","memberId":"1"},{"id":"d1121","type":"in","amount":1380.0,"categoryId":"ci0","note":"Stipendio","date":"2023-12-01","memberId":"1"},{"id":"d1122","type":"in","amount":1077.0,"categoryId":"ci0","note":"Stipendio partner","date":"2023-12-01","memberId":"1"},{"id":"d1123","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2023-12-01","memberId":"1"},{"id":"d1124","type":"out","amount":73.0,"categoryId":"co0","note":"Luce","date":"2023-12-01","memberId":"1"},{"id":"d1125","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2023-12-01","memberId":"1"},{"id":"d1126","type":"out","amount":410.0,"categoryId":"co1","note":"Spesa settimanale","date":"2023-12-01","memberId":"1"},{"id":"d1127","type":"out","amount":97.0,"categoryId":"co2","note":"Assicurazione auto","date":"2023-12-01","memberId":"1"},{"id":"d1128","type":"out","amount":83.0,"categoryId":"co11","note":"Pranzo lavoro","date":"2023-12-01","memberId":"1"},{"id":"d1129","type":"out","amount":79.0,"categoryId":"co3","note":"Fisioterapia","date":"2023-12-01","memberId":"1"},{"id":"d1130","type":"out","amount":39.0,"categoryId":"co4","note":"Cinema","date":"2023-12-01","memberId":"1"},{"id":"d1131","type":"out","amount":363.0,"categoryId":"co10","note":"Viaggio natalizio","date":"2023-12-01","memberId":"1"},{"id":"d1132","type":"in","amount":1319.0,"categoryId":"ci0","note":"Stipendio","date":"2024-01-01","memberId":"1"},{"id":"d1133","type":"in","amount":1217.0,"categoryId":"ci0","note":"Stipendio partner","date":"2024-01-01","memberId":"1"},{"id":"d1134","type":"in","amount":585.0,"categoryId":"ci2","note":"Rendita investimento","date":"2024-01-01","memberId":"1"},{"id":"d1135","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2024-01-01","memberId":"1"},{"id":"d1136","type":"out","amount":141.0,"categoryId":"co0","note":"Luce","date":"2024-01-01","memberId":"1"},{"id":"d1137","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2024-01-01","memberId":"1"},{"id":"d1138","type":"out","amount":346.0,"categoryId":"co1","note":"Spesa settimanale","date":"2024-01-01","memberId":"1"},{"id":"d1139","type":"out","amount":86.0,"categoryId":"co2","note":"Tagliando","date":"2024-01-01","memberId":"1"},{"id":"d1140","type":"out","amount":194.0,"categoryId":"co11","note":"Cena fuori","date":"2024-01-01","memberId":"1"},{"id":"d1141","type":"out","amount":37.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2024-01-01","memberId":"1"},{"id":"d1142","type":"out","amount":175.0,"categoryId":"co5","note":"Abbigliamento","date":"2024-01-01","memberId":"1"},{"id":"d1143","type":"out","amount":340.0,"categoryId":"co10","note":"Viaggio natalizio","date":"2024-01-01","memberId":"1"},{"id":"d1144","type":"in","amount":1408.0,"categoryId":"ci0","note":"Stipendio","date":"2024-02-01","memberId":"1"},{"id":"d1145","type":"in","amount":1165.0,"categoryId":"ci0","note":"Stipendio partner","date":"2024-02-01","memberId":"1"},{"id":"d1146","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2024-02-01","memberId":"1"},{"id":"d1147","type":"out","amount":115.0,"categoryId":"co0","note":"Luce","date":"2024-02-01","memberId":"1"},{"id":"d1148","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2024-02-01","memberId":"1"},{"id":"d1149","type":"out","amount":326.0,"categoryId":"co1","note":"Spesa biologica","date":"2024-02-01","memberId":"1"},{"id":"d1150","type":"out","amount":135.0,"categoryId":"co2","note":"Assicurazione auto","date":"2024-02-01","memberId":"1"},{"id":"d1151","type":"out","amount":177.0,"categoryId":"co11","note":"Aperitivo","date":"2024-02-01","memberId":"1"},{"id":"d1152","type":"out","amount":64.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2024-02-01","memberId":"1"},{"id":"d1153","type":"in","amount":1528.0,"categoryId":"ci0","note":"Stipendio","date":"2024-03-01","memberId":"1"},{"id":"d1154","type":"in","amount":1166.0,"categoryId":"ci0","note":"Stipendio partner","date":"2024-03-01","memberId":"1"},{"id":"d1155","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2024-03-01","memberId":"1"},{"id":"d1156","type":"out","amount":166.0,"categoryId":"co0","note":"Luce","date":"2024-03-01","memberId":"1"},{"id":"d1157","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2024-03-01","memberId":"1"},{"id":"d1158","type":"out","amount":465.0,"categoryId":"co1","note":"Supermercato","date":"2024-03-01","memberId":"1"},{"id":"d1159","type":"out","amount":150.0,"categoryId":"co2","note":"Bollo auto","date":"2024-03-01","memberId":"1"},{"id":"d1160","type":"out","amount":195.0,"categoryId":"co11","note":"Pranzo lavoro","date":"2024-03-01","memberId":"1"},{"id":"d1161","type":"out","amount":130.0,"categoryId":"co3","note":"Visita medica","date":"2024-03-01","memberId":"1"},{"id":"d1162","type":"out","amount":58.0,"categoryId":"co4","note":"Amazon Prime","date":"2024-03-01","memberId":"1"},{"id":"d1163","type":"out","amount":63.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2024-03-01","memberId":"1"},{"id":"d1164","type":"out","amount":121.0,"categoryId":"co5","note":"Abbigliamento","date":"2024-03-01","memberId":"1"},{"id":"d1165","type":"in","amount":1416.0,"categoryId":"ci0","note":"Stipendio","date":"2024-04-01","memberId":"1"},{"id":"d1166","type":"in","amount":1127.0,"categoryId":"ci0","note":"Stipendio partner","date":"2024-04-01","memberId":"1"},{"id":"d1167","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2024-04-01","memberId":"1"},{"id":"d1168","type":"out","amount":133.0,"categoryId":"co0","note":"Luce","date":"2024-04-01","memberId":"1"},{"id":"d1169","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2024-04-01","memberId":"1"},{"id":"d1170","type":"out","amount":379.0,"categoryId":"co1","note":"Spesa biologica","date":"2024-04-01","memberId":"1"},{"id":"d1171","type":"out","amount":104.0,"categoryId":"co2","note":"Tagliando","date":"2024-04-01","memberId":"1"},{"id":"d1172","type":"out","amount":162.0,"categoryId":"co11","note":"Cena fuori","date":"2024-04-01","memberId":"1"},{"id":"d1173","type":"out","amount":68.0,"categoryId":"co3","note":"Parrucchiere","date":"2024-04-01","memberId":"1"},{"id":"d1174","type":"out","amount":18.0,"categoryId":"co4","note":"Amazon Prime","date":"2024-04-01","memberId":"1"},{"id":"d1175","type":"out","amount":64.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2024-04-01","memberId":"1"},{"id":"d1176","type":"in","amount":1368.0,"categoryId":"ci0","note":"Stipendio","date":"2024-05-01","memberId":"1"},{"id":"d1177","type":"in","amount":1215.0,"categoryId":"ci0","note":"Stipendio partner","date":"2024-05-01","memberId":"1"},{"id":"d1178","type":"in","amount":624.0,"categoryId":"ci1","note":"Progetto extra","date":"2024-05-01","memberId":"1"},{"id":"d1179","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2024-05-01","memberId":"1"},{"id":"d1180","type":"out","amount":137.0,"categoryId":"co0","note":"Luce","date":"2024-05-01","memberId":"1"},{"id":"d1181","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2024-05-01","memberId":"1"},{"id":"d1182","type":"out","amount":371.0,"categoryId":"co1","note":"Spesa biologica","date":"2024-05-01","memberId":"1"},{"id":"d1183","type":"out","amount":111.0,"categoryId":"co2","note":"Tagliando","date":"2024-05-01","memberId":"1"},{"id":"d1184","type":"out","amount":174.0,"categoryId":"co11","note":"Pranzo lavoro","date":"2024-05-01","memberId":"1"},{"id":"d1185","type":"in","amount":1486.0,"categoryId":"ci0","note":"Stipendio","date":"2024-06-01","memberId":"1"},{"id":"d1186","type":"in","amount":1027.0,"categoryId":"ci0","note":"Stipendio partner","date":"2024-06-01","memberId":"1"},{"id":"d1187","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2024-06-01","memberId":"1"},{"id":"d1188","type":"out","amount":108.0,"categoryId":"co0","note":"Luce","date":"2024-06-01","memberId":"1"},{"id":"d1189","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2024-06-01","memberId":"1"},{"id":"d1190","type":"out","amount":477.0,"categoryId":"co1","note":"Spesa settimanale","date":"2024-06-01","memberId":"1"},{"id":"d1191","type":"out","amount":97.0,"categoryId":"co2","note":"Benzina","date":"2024-06-01","memberId":"1"},{"id":"d1192","type":"out","amount":134.0,"categoryId":"co11","note":"Pranzo lavoro","date":"2024-06-01","memberId":"1"},{"id":"d1193","type":"out","amount":34.0,"categoryId":"co3","note":"Dentista","date":"2024-06-01","memberId":"1"},{"id":"d1194","type":"out","amount":50.0,"categoryId":"co4","note":"Amazon Prime","date":"2024-06-01","memberId":"1"},{"id":"d1195","type":"out","amount":63.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2024-06-01","memberId":"1"},{"id":"d1196","type":"out","amount":141.0,"categoryId":"co5","note":"Abbigliamento","date":"2024-06-01","memberId":"1"},{"id":"d1197","type":"in","amount":1385.0,"categoryId":"ci0","note":"Stipendio","date":"2024-07-01","memberId":"1"},{"id":"d1198","type":"in","amount":1069.0,"categoryId":"ci0","note":"Stipendio partner","date":"2024-07-01","memberId":"1"},{"id":"d1199","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2024-07-01","memberId":"1"},{"id":"d1200","type":"out","amount":165.0,"categoryId":"co0","note":"Luce","date":"2024-07-01","memberId":"1"},{"id":"d1201","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2024-07-01","memberId":"1"},{"id":"d1202","type":"out","amount":368.0,"categoryId":"co1","note":"Spesa settimanale","date":"2024-07-01","memberId":"1"},{"id":"d1203","type":"out","amount":139.0,"categoryId":"co2","note":"Benzina","date":"2024-07-01","memberId":"1"},{"id":"d1204","type":"out","amount":92.0,"categoryId":"co11","note":"Pranzo lavoro","date":"2024-07-01","memberId":"1"},{"id":"d1205","type":"out","amount":113.0,"categoryId":"co3","note":"Dentista","date":"2024-07-01","memberId":"1"},{"id":"d1206","type":"out","amount":78.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2024-07-01","memberId":"1"},{"id":"d1207","type":"out","amount":368.0,"categoryId":"co10","note":"Vacanza","date":"2024-07-01","memberId":"1"},{"id":"d1208","type":"in","amount":1451.0,"categoryId":"ci0","note":"Stipendio","date":"2024-08-01","memberId":"1"},{"id":"d1209","type":"in","amount":1186.0,"categoryId":"ci0","note":"Stipendio partner","date":"2024-08-01","memberId":"1"},{"id":"d1210","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2024-08-01","memberId":"1"},{"id":"d1211","type":"out","amount":164.0,"categoryId":"co0","note":"Luce","date":"2024-08-01","memberId":"1"},{"id":"d1212","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2024-08-01","memberId":"1"},{"id":"d1213","type":"out","amount":477.0,"categoryId":"co1","note":"Prodotti casa","date":"2024-08-01","memberId":"1"},{"id":"d1214","type":"out","amount":93.0,"categoryId":"co2","note":"Assicurazione auto","date":"2024-08-01","memberId":"1"},{"id":"d1215","type":"out","amount":123.0,"categoryId":"co11","note":"Pizza","date":"2024-08-01","memberId":"1"},{"id":"d1216","type":"out","amount":100.0,"categoryId":"co3","note":"Dentista","date":"2024-08-01","memberId":"1"},{"id":"d1217","type":"out","amount":68.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2024-08-01","memberId":"1"},{"id":"d1218","type":"out","amount":65.0,"categoryId":"co5","note":"Abbigliamento","date":"2024-08-01","memberId":"1"},{"id":"d1219","type":"out","amount":783.0,"categoryId":"co10","note":"Vacanza","date":"2024-08-01","memberId":"1"},{"id":"d1220","type":"in","amount":1436.0,"categoryId":"ci0","note":"Stipendio","date":"2024-09-01","memberId":"1"},{"id":"d1221","type":"in","amount":1063.0,"categoryId":"ci0","note":"Stipendio partner","date":"2024-09-01","memberId":"1"},{"id":"d1222","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2024-09-01","memberId":"1"},{"id":"d1223","type":"out","amount":175.0,"categoryId":"co0","note":"Luce","date":"2024-09-01","memberId":"1"},{"id":"d1224","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2024-09-01","memberId":"1"},{"id":"d1225","type":"out","amount":365.0,"categoryId":"co1","note":"Supermercato","date":"2024-09-01","memberId":"1"},{"id":"d1226","type":"out","amount":150.0,"categoryId":"co2","note":"Assicurazione auto","date":"2024-09-01","memberId":"1"},{"id":"d1227","type":"out","amount":169.0,"categoryId":"co11","note":"Pizza","date":"2024-09-01","memberId":"1"},{"id":"d1228","type":"out","amount":18.0,"categoryId":"co4","note":"Spotify","date":"2024-09-01","memberId":"1"},{"id":"d1229","type":"out","amount":70.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2024-09-01","memberId":"1"},{"id":"d1230","type":"in","amount":1356.0,"categoryId":"ci0","note":"Stipendio","date":"2024-10-01","memberId":"1"},{"id":"d1231","type":"in","amount":1128.0,"categoryId":"ci0","note":"Stipendio partner","date":"2024-10-01","memberId":"1"},{"id":"d1232","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2024-10-01","memberId":"1"},{"id":"d1233","type":"out","amount":64.0,"categoryId":"co0","note":"Luce","date":"2024-10-01","memberId":"1"},{"id":"d1234","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2024-10-01","memberId":"1"},{"id":"d1235","type":"out","amount":421.0,"categoryId":"co1","note":"Supermercato","date":"2024-10-01","memberId":"1"},{"id":"d1236","type":"out","amount":115.0,"categoryId":"co2","note":"Bollo auto","date":"2024-10-01","memberId":"1"},{"id":"d1237","type":"out","amount":139.0,"categoryId":"co11","note":"Pranzo lavoro","date":"2024-10-01","memberId":"1"},{"id":"d1238","type":"out","amount":129.0,"categoryId":"co3","note":"Dentista","date":"2024-10-01","memberId":"1"},{"id":"d1239","type":"out","amount":48.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2024-10-01","memberId":"1"},{"id":"d1240","type":"out","amount":196.0,"categoryId":"co5","note":"Abbigliamento","date":"2024-10-01","memberId":"1"},{"id":"d1241","type":"in","amount":1553.0,"categoryId":"ci0","note":"Stipendio","date":"2024-11-01","memberId":"1"},{"id":"d1242","type":"in","amount":1183.0,"categoryId":"ci0","note":"Stipendio partner","date":"2024-11-01","memberId":"1"},{"id":"d1243","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2024-11-01","memberId":"1"},{"id":"d1244","type":"out","amount":122.0,"categoryId":"co0","note":"Luce","date":"2024-11-01","memberId":"1"},{"id":"d1245","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2024-11-01","memberId":"1"},{"id":"d1246","type":"out","amount":393.0,"categoryId":"co1","note":"Supermercato","date":"2024-11-01","memberId":"1"},{"id":"d1247","type":"out","amount":88.0,"categoryId":"co2","note":"Bollo auto","date":"2024-11-01","memberId":"1"},{"id":"d1248","type":"out","amount":105.0,"categoryId":"co11","note":"Aperitivo","date":"2024-11-01","memberId":"1"},{"id":"d1249","type":"out","amount":98.0,"categoryId":"co3","note":"Dentista","date":"2024-11-01","memberId":"1"},{"id":"d1250","type":"out","amount":57.0,"categoryId":"co4","note":"Netflix","date":"2024-11-01","memberId":"1"},{"id":"d1251","type":"out","amount":48.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2024-11-01","memberId":"1"},{"id":"d1252","type":"in","amount":1341.0,"categoryId":"ci0","note":"Stipendio","date":"2024-12-01","memberId":"1"},{"id":"d1253","type":"in","amount":1201.0,"categoryId":"ci0","note":"Stipendio partner","date":"2024-12-01","memberId":"1"},{"id":"d1254","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2024-12-01","memberId":"1"},{"id":"d1255","type":"out","amount":145.0,"categoryId":"co0","note":"Luce","date":"2024-12-01","memberId":"1"},{"id":"d1256","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2024-12-01","memberId":"1"},{"id":"d1257","type":"out","amount":422.0,"categoryId":"co1","note":"Prodotti casa","date":"2024-12-01","memberId":"1"},{"id":"d1258","type":"out","amount":106.0,"categoryId":"co2","note":"Assicurazione auto","date":"2024-12-01","memberId":"1"},{"id":"d1259","type":"out","amount":165.0,"categoryId":"co11","note":"Pranzo lavoro","date":"2024-12-01","memberId":"1"},{"id":"d1260","type":"out","amount":67.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2024-12-01","memberId":"1"},{"id":"d1261","type":"out","amount":84.0,"categoryId":"co5","note":"Abbigliamento","date":"2024-12-01","memberId":"1"},{"id":"d1262","type":"out","amount":752.0,"categoryId":"co10","note":"Viaggio natalizio","date":"2024-12-01","memberId":"1"},{"id":"d1263","type":"in","amount":1542.0,"categoryId":"ci0","note":"Stipendio","date":"2025-01-01","memberId":"1"},{"id":"d1264","type":"in","amount":1202.0,"categoryId":"ci0","note":"Stipendio partner","date":"2025-01-01","memberId":"1"},{"id":"d1265","type":"in","amount":471.0,"categoryId":"ci3","note":"Bonus trimestrale","date":"2025-01-01","memberId":"1"},{"id":"d1266","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2025-01-01","memberId":"1"},{"id":"d1267","type":"out","amount":92.0,"categoryId":"co0","note":"Luce","date":"2025-01-01","memberId":"1"},{"id":"d1268","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2025-01-01","memberId":"1"},{"id":"d1269","type":"out","amount":384.0,"categoryId":"co1","note":"Spesa settimanale","date":"2025-01-01","memberId":"1"},{"id":"d1270","type":"out","amount":97.0,"categoryId":"co2","note":"Bollo auto","date":"2025-01-01","memberId":"1"},{"id":"d1271","type":"out","amount":124.0,"categoryId":"co11","note":"Pranzo lavoro","date":"2025-01-01","memberId":"1"},{"id":"d1272","type":"out","amount":104.0,"categoryId":"co3","note":"Visita medica","date":"2025-01-01","memberId":"1"},{"id":"d1273","type":"out","amount":102.0,"categoryId":"co5","note":"Abbigliamento","date":"2025-01-01","memberId":"1"},{"id":"d1274","type":"out","amount":664.0,"categoryId":"co10","note":"Viaggio natalizio","date":"2025-01-01","memberId":"1"},{"id":"d1275","type":"in","amount":1571.0,"categoryId":"ci0","note":"Stipendio","date":"2025-02-01","memberId":"1"},{"id":"d1276","type":"in","amount":1032.0,"categoryId":"ci0","note":"Stipendio partner","date":"2025-02-01","memberId":"1"},{"id":"d1277","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2025-02-01","memberId":"1"},{"id":"d1278","type":"out","amount":72.0,"categoryId":"co0","note":"Luce","date":"2025-02-01","memberId":"1"},{"id":"d1279","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2025-02-01","memberId":"1"},{"id":"d1280","type":"out","amount":423.0,"categoryId":"co1","note":"Spesa biologica","date":"2025-02-01","memberId":"1"},{"id":"d1281","type":"out","amount":130.0,"categoryId":"co2","note":"Benzina","date":"2025-02-01","memberId":"1"},{"id":"d1282","type":"out","amount":132.0,"categoryId":"co11","note":"Aperitivo","date":"2025-02-01","memberId":"1"},{"id":"d1283","type":"out","amount":10.0,"categoryId":"co4","note":"Cinema","date":"2025-02-01","memberId":"1"},{"id":"d1284","type":"out","amount":56.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2025-02-01","memberId":"1"},{"id":"d1285","type":"in","amount":1363.0,"categoryId":"ci0","note":"Stipendio","date":"2025-03-01","memberId":"1"},{"id":"d1286","type":"in","amount":1107.0,"categoryId":"ci0","note":"Stipendio partner","date":"2025-03-01","memberId":"1"},{"id":"d1287","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2025-03-01","memberId":"1"},{"id":"d1288","type":"out","amount":117.0,"categoryId":"co0","note":"Luce","date":"2025-03-01","memberId":"1"},{"id":"d1289","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2025-03-01","memberId":"1"},{"id":"d1290","type":"out","amount":383.0,"categoryId":"co1","note":"Spesa settimanale","date":"2025-03-01","memberId":"1"},{"id":"d1291","type":"out","amount":146.0,"categoryId":"co2","note":"Tagliando","date":"2025-03-01","memberId":"1"},{"id":"d1292","type":"out","amount":171.0,"categoryId":"co11","note":"Pizza","date":"2025-03-01","memberId":"1"},{"id":"d1293","type":"out","amount":44.0,"categoryId":"co3","note":"Dentista","date":"2025-03-01","memberId":"1"},{"id":"d1294","type":"in","amount":1502.0,"categoryId":"ci0","note":"Stipendio","date":"2025-04-01","memberId":"1"},{"id":"d1295","type":"in","amount":1147.0,"categoryId":"ci0","note":"Stipendio partner","date":"2025-04-01","memberId":"1"},{"id":"d1296","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2025-04-01","memberId":"1"},{"id":"d1297","type":"out","amount":88.0,"categoryId":"co0","note":"Luce","date":"2025-04-01","memberId":"1"},{"id":"d1298","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2025-04-01","memberId":"1"},{"id":"d1299","type":"out","amount":311.0,"categoryId":"co1","note":"Prodotti casa","date":"2025-04-01","memberId":"1"},{"id":"d1300","type":"out","amount":147.0,"categoryId":"co2","note":"Benzina","date":"2025-04-01","memberId":"1"},{"id":"d1301","type":"out","amount":114.0,"categoryId":"co11","note":"Cena fuori","date":"2025-04-01","memberId":"1"},{"id":"d1302","type":"out","amount":107.0,"categoryId":"co3","note":"Visita medica","date":"2025-04-01","memberId":"1"},{"id":"d1303","type":"out","amount":60.0,"categoryId":"co4","note":"Cinema","date":"2025-04-01","memberId":"1"},{"id":"d1304","type":"out","amount":60.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2025-04-01","memberId":"1"},{"id":"d1305","type":"in","amount":1440.0,"categoryId":"ci0","note":"Stipendio","date":"2025-05-01","memberId":"1"},{"id":"d1306","type":"in","amount":1184.0,"categoryId":"ci0","note":"Stipendio partner","date":"2025-05-01","memberId":"1"},{"id":"d1307","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2025-05-01","memberId":"1"},{"id":"d1308","type":"out","amount":165.0,"categoryId":"co0","note":"Luce","date":"2025-05-01","memberId":"1"},{"id":"d1309","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2025-05-01","memberId":"1"},{"id":"d1310","type":"out","amount":396.0,"categoryId":"co1","note":"Spesa biologica","date":"2025-05-01","memberId":"1"},{"id":"d1311","type":"out","amount":94.0,"categoryId":"co2","note":"Benzina","date":"2025-05-01","memberId":"1"},{"id":"d1312","type":"out","amount":111.0,"categoryId":"co11","note":"Pizza","date":"2025-05-01","memberId":"1"},{"id":"d1313","type":"out","amount":53.0,"categoryId":"co3","note":"Medicinali","date":"2025-05-01","memberId":"1"},{"id":"d1314","type":"out","amount":10.0,"categoryId":"co4","note":"Amazon Prime","date":"2025-05-01","memberId":"1"},{"id":"d1315","type":"out","amount":51.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2025-05-01","memberId":"1"},{"id":"d1316","type":"out","amount":88.0,"categoryId":"co5","note":"Abbigliamento","date":"2025-05-01","memberId":"1"},{"id":"d1317","type":"in","amount":1421.0,"categoryId":"ci0","note":"Stipendio","date":"2025-06-01","memberId":"1"},{"id":"d1318","type":"in","amount":1249.0,"categoryId":"ci0","note":"Stipendio partner","date":"2025-06-01","memberId":"1"},{"id":"d1319","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2025-06-01","memberId":"1"},{"id":"d1320","type":"out","amount":159.0,"categoryId":"co0","note":"Luce","date":"2025-06-01","memberId":"1"},{"id":"d1321","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2025-06-01","memberId":"1"},{"id":"d1322","type":"out","amount":319.0,"categoryId":"co1","note":"Supermercato","date":"2025-06-01","memberId":"1"},{"id":"d1323","type":"out","amount":85.0,"categoryId":"co2","note":"Bollo auto","date":"2025-06-01","memberId":"1"},{"id":"d1324","type":"out","amount":197.0,"categoryId":"co11","note":"Pranzo lavoro","date":"2025-06-01","memberId":"1"},{"id":"d1325","type":"out","amount":109.0,"categoryId":"co3","note":"Dentista","date":"2025-06-01","memberId":"1"},{"id":"d1326","type":"out","amount":33.0,"categoryId":"co4","note":"Amazon Prime","date":"2025-06-01","memberId":"1"},{"id":"d1327","type":"in","amount":1595.0,"categoryId":"ci0","note":"Stipendio","date":"2025-07-01","memberId":"1"},{"id":"d1328","type":"in","amount":1150.0,"categoryId":"ci0","note":"Stipendio partner","date":"2025-07-01","memberId":"1"},{"id":"d1329","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2025-07-01","memberId":"1"},{"id":"d1330","type":"out","amount":115.0,"categoryId":"co0","note":"Luce","date":"2025-07-01","memberId":"1"},{"id":"d1331","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2025-07-01","memberId":"1"},{"id":"d1332","type":"out","amount":414.0,"categoryId":"co1","note":"Supermercato","date":"2025-07-01","memberId":"1"},{"id":"d1333","type":"out","amount":84.0,"categoryId":"co2","note":"Assicurazione auto","date":"2025-07-01","memberId":"1"},{"id":"d1334","type":"out","amount":177.0,"categoryId":"co11","note":"Pranzo lavoro","date":"2025-07-01","memberId":"1"},{"id":"d1335","type":"out","amount":15.0,"categoryId":"co3","note":"Fisioterapia","date":"2025-07-01","memberId":"1"},{"id":"d1336","type":"out","amount":58.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2025-07-01","memberId":"1"},{"id":"d1337","type":"out","amount":83.0,"categoryId":"co5","note":"Abbigliamento","date":"2025-07-01","memberId":"1"},{"id":"d1338","type":"out","amount":544.0,"categoryId":"co10","note":"Vacanza","date":"2025-07-01","memberId":"1"},{"id":"d1339","type":"in","amount":1334.0,"categoryId":"ci0","note":"Stipendio","date":"2025-08-01","memberId":"1"},{"id":"d1340","type":"in","amount":1170.0,"categoryId":"ci0","note":"Stipendio partner","date":"2025-08-01","memberId":"1"},{"id":"d1341","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2025-08-01","memberId":"1"},{"id":"d1342","type":"out","amount":118.0,"categoryId":"co0","note":"Luce","date":"2025-08-01","memberId":"1"},{"id":"d1343","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2025-08-01","memberId":"1"},{"id":"d1344","type":"out","amount":320.0,"categoryId":"co1","note":"Spesa settimanale","date":"2025-08-01","memberId":"1"},{"id":"d1345","type":"out","amount":109.0,"categoryId":"co2","note":"Benzina","date":"2025-08-01","memberId":"1"},{"id":"d1346","type":"out","amount":176.0,"categoryId":"co11","note":"Cena fuori","date":"2025-08-01","memberId":"1"},{"id":"d1347","type":"out","amount":39.0,"categoryId":"co4","note":"Spotify","date":"2025-08-01","memberId":"1"},{"id":"d1348","type":"out","amount":150.0,"categoryId":"co5","note":"Abbigliamento","date":"2025-08-01","memberId":"1"},{"id":"d1349","type":"out","amount":618.0,"categoryId":"co10","note":"Vacanza","date":"2025-08-01","memberId":"1"},{"id":"d1350","type":"in","amount":1597.0,"categoryId":"ci0","note":"Stipendio","date":"2025-09-01","memberId":"1"},{"id":"d1351","type":"in","amount":1040.0,"categoryId":"ci0","note":"Stipendio partner","date":"2025-09-01","memberId":"1"},{"id":"d1352","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2025-09-01","memberId":"1"},{"id":"d1353","type":"out","amount":113.0,"categoryId":"co0","note":"Luce","date":"2025-09-01","memberId":"1"},{"id":"d1354","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2025-09-01","memberId":"1"},{"id":"d1355","type":"out","amount":494.0,"categoryId":"co1","note":"Prodotti casa","date":"2025-09-01","memberId":"1"},{"id":"d1356","type":"out","amount":146.0,"categoryId":"co2","note":"Bollo auto","date":"2025-09-01","memberId":"1"},{"id":"d1357","type":"out","amount":185.0,"categoryId":"co11","note":"Aperitivo","date":"2025-09-01","memberId":"1"},{"id":"d1358","type":"out","amount":65.0,"categoryId":"co3","note":"Medicinali","date":"2025-09-01","memberId":"1"},{"id":"d1359","type":"out","amount":54.0,"categoryId":"co4","note":"Spotify","date":"2025-09-01","memberId":"1"},{"id":"d1360","type":"out","amount":73.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2025-09-01","memberId":"1"},{"id":"d1361","type":"in","amount":1422.0,"categoryId":"ci0","note":"Stipendio","date":"2025-10-01","memberId":"1"},{"id":"d1362","type":"in","amount":1194.0,"categoryId":"ci0","note":"Stipendio partner","date":"2025-10-01","memberId":"1"},{"id":"d1363","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2025-10-01","memberId":"1"},{"id":"d1364","type":"out","amount":166.0,"categoryId":"co0","note":"Luce","date":"2025-10-01","memberId":"1"},{"id":"d1365","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2025-10-01","memberId":"1"},{"id":"d1366","type":"out","amount":474.0,"categoryId":"co1","note":"Supermercato","date":"2025-10-01","memberId":"1"},{"id":"d1367","type":"out","amount":129.0,"categoryId":"co2","note":"Tagliando","date":"2025-10-01","memberId":"1"},{"id":"d1368","type":"out","amount":136.0,"categoryId":"co11","note":"Cena fuori","date":"2025-10-01","memberId":"1"},{"id":"d1369","type":"out","amount":50.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2025-10-01","memberId":"1"},{"id":"d1370","type":"out","amount":200.0,"categoryId":"co5","note":"Abbigliamento","date":"2025-10-01","memberId":"1"},{"id":"d1371","type":"in","amount":1484.0,"categoryId":"ci0","note":"Stipendio","date":"2025-11-01","memberId":"1"},{"id":"d1372","type":"in","amount":1040.0,"categoryId":"ci0","note":"Stipendio partner","date":"2025-11-01","memberId":"1"},{"id":"d1373","type":"in","amount":744.0,"categoryId":"ci1","note":"Progetto extra","date":"2025-11-01","memberId":"1"},{"id":"d1374","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2025-11-01","memberId":"1"},{"id":"d1375","type":"out","amount":84.0,"categoryId":"co0","note":"Luce","date":"2025-11-01","memberId":"1"},{"id":"d1376","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2025-11-01","memberId":"1"},{"id":"d1377","type":"out","amount":332.0,"categoryId":"co1","note":"Supermercato","date":"2025-11-01","memberId":"1"},{"id":"d1378","type":"out","amount":138.0,"categoryId":"co2","note":"Benzina","date":"2025-11-01","memberId":"1"},{"id":"d1379","type":"out","amount":157.0,"categoryId":"co11","note":"Pizza","date":"2025-11-01","memberId":"1"},{"id":"d1380","type":"out","amount":119.0,"categoryId":"co3","note":"Fisioterapia","date":"2025-11-01","memberId":"1"},{"id":"d1381","type":"out","amount":66.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2025-11-01","memberId":"1"},{"id":"d1382","type":"out","amount":187.0,"categoryId":"co5","note":"Abbigliamento","date":"2025-11-01","memberId":"1"},{"id":"d1383","type":"in","amount":1568.0,"categoryId":"ci0","note":"Stipendio","date":"2025-12-01","memberId":"1"},{"id":"d1384","type":"in","amount":1080.0,"categoryId":"ci0","note":"Stipendio partner","date":"2025-12-01","memberId":"1"},{"id":"d1385","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2025-12-01","memberId":"1"},{"id":"d1386","type":"out","amount":88.0,"categoryId":"co0","note":"Luce","date":"2025-12-01","memberId":"1"},{"id":"d1387","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2025-12-01","memberId":"1"},{"id":"d1388","type":"out","amount":457.0,"categoryId":"co1","note":"Prodotti casa","date":"2025-12-01","memberId":"1"},{"id":"d1389","type":"out","amount":83.0,"categoryId":"co2","note":"Tagliando","date":"2025-12-01","memberId":"1"},{"id":"d1390","type":"out","amount":175.0,"categoryId":"co11","note":"Pranzo lavoro","date":"2025-12-01","memberId":"1"},{"id":"d1391","type":"out","amount":56.0,"categoryId":"co3","note":"Dentista","date":"2025-12-01","memberId":"1"},{"id":"d1392","type":"out","amount":24.0,"categoryId":"co4","note":"Libri","date":"2025-12-01","memberId":"1"},{"id":"d1393","type":"out","amount":66.0,"categoryId":"co9","note":"Abbonamento palestra","date":"2025-12-01","memberId":"1"},{"id":"d1394","type":"out","amount":672.0,"categoryId":"co10","note":"Viaggio natalizio","date":"2025-12-01","memberId":"1"},{"id":"dm01","type":"in","amount":1420.0,"categoryId":"ci0","note":"Stipendio","date":"2026-03-01","memberId":"1"},{"id":"dm02","type":"in","amount":1100.0,"categoryId":"ci0","note":"Stipendio partner","date":"2026-03-01","memberId":"1"},{"id":"dm03","type":"out","amount":500.0,"categoryId":"co0","note":"Mutuo","date":"2026-03-02","memberId":"1"},{"id":"dm04","type":"out","amount":30.0,"categoryId":"co0","note":"Internet","date":"2026-03-02","memberId":"1"},{"id":"dm05","type":"out","amount":95.0,"categoryId":"co0","note":"Luce","date":"2026-03-05","memberId":"1"},{"id":"dm06","type":"out","amount":340.0,"categoryId":"co1","note":"Spesa settimanale","date":"2026-03-06","memberId":"1"},{"id":"dm07","type":"out","amount":110.0,"categoryId":"co2","note":"Benzina","date":"2026-03-08","memberId":"1"},{"id":"dm08","type":"out","amount":145.0,"categoryId":"co11","note":"Cena fuori","date":"2026-03-09","memberId":"1"},{"id":"dm09","type":"out","amount":55.0,"categoryId":"co9","note":"Palestra","date":"2026-03-10","memberId":"1"},{"id":"dm10","type":"out","amount":80.0,"categoryId":"co3","note":"Visita medica","date":"2026-03-12","memberId":"1"},{"id":"dm11","type":"out","amount":120.0,"categoryId":"co5","note":"Abbigliamento","date":"2026-03-14","memberId":"1"},{"id":"dm12","type":"out","amount":22.0,"categoryId":"co4","note":"Netflix","date":"2026-03-15","memberId":"1"},{"id":"dm13","type":"out","amount":45.0,"categoryId":"co10","note":"Weekend fuori","date":"2026-03-16","memberId":"1"},{"id":"dm14","type":"in","amount":350.0,"categoryId":"ci1","note":"Progetto extra","date":"2026-03-18","memberId":"1"},{"id":"dm15","type":"out","amount":65.0,"categoryId":"co3","note":"Medicinali","date":"2026-03-19","memberId":"1"}];

const INIT_TRANSACTIONS = [...HISTORICAL_TRANSACTIONS];

// ─────────────────────────────────────────────────────────────────────────────
// COSTANTI UI
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN SYSTEM — Apple-inspired
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  bg:        "#000000",
  surface:   "#0a0a0a",
  card:      "rgba(28,28,30,0.95)",
  cardSolid: "#1c1c1e",
  border:    "rgba(255,255,255,0.08)",
  borderHi:  "rgba(255,255,255,0.15)",
  text:      "#ffffff",
  textSec:   "rgba(255,255,255,0.55)",
  muted:     "rgba(255,255,255,0.28)",
  accent:    "#0a84ff",
  accentAlt: "#5e5ce6",
  green:     "#30d158",
  greenDim:  "rgba(48,209,88,0.14)",
  red:       "#ff453a",
  redDim:    "rgba(255,69,58,0.14)",
  amber:     "#ffd60a",
  glass:     "rgba(255,255,255,0.05)",
  glassMd:   "rgba(255,255,255,0.09)",
};
const SF = `-apple-system,"SF Pro Display","SF Pro Text",BlinkMacSystemFont,"Helvetica Neue",sans-serif`;
const MONTHS = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno",
                "Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
const fmt = n => new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR"}).format(n);
const now = new Date();

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTI ATOMICI
// ─────────────────────────────────────────────────────────────────────────────

// Sparkline SVG
function Sparkline({ points, color, width=80, height=28 }) {
  if (!points || points.length < 2) return null;
  const max = Math.max(...points, 1), min = Math.min(...points, 0);
  const range = max - min || 1;
  const xs = points.map((_,i) => (i/(points.length-1))*width);
  const ys = points.map(v => height - ((v-min)/range)*(height-4) - 2);
  const d = xs.map((x,i) => `${i===0?"M":"L"}${x},${ys[i]}`).join(" ");
  const fill = d + ` L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} style={{overflow:"visible"}}>
      <defs>
        <linearGradient id={`sg${color.replace(/[^a-z0-9]/gi,"")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#sg${color.replace(/[^a-z0-9]/gi,"")})`}/>
      <path d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={xs[xs.length-1]} cy={ys[ys.length-1]} r="2.5" fill={color}/>
    </svg>
  );
}

// Card vetro
function GlassCard({ children, style={}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: C.card,
      backdropFilter: "blur(40px) saturate(180%)",
      WebkitBackdropFilter: "blur(40px) saturate(180%)",
      border: `0.5px solid ${C.borderHi}`,
      borderRadius: 22,
      overflow: "hidden",
      ...style,
    }}>
      {children}
    </div>
  );
}

// Badge importo
function AmountBadge({ amount, type }) {
  const isIn = type === "in";
  return (
    <span style={{
      fontSize: 13, fontWeight: 700, letterSpacing: -0.3,
      color: isIn ? C.green : C.red,
      background: isIn ? C.greenDim : C.redDim,
      borderRadius: 8, padding: "3px 8px",
    }}>
      {isIn ? "+" : "-"}{fmt(Math.abs(amount))}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]   = useState("login");  // demo pubblica: accesso diretto senza PIN
  const [loaded, setLoaded] = useState(false);
  // Demo pubblica — PIN rimosso

  const [userTxs,       setUserTxs]       = useState([]);
  const [deletedIds,    setDeletedIds]    = useState([]);
  const [members,       setMembers]       = useState(INIT_MEMBERS);
  const [currentMember, setCurrentMember] = useState("1");
  const [categories,    setCategories]    = useState(INIT_CATEGORIES);
  const [recurring,     setRecurring]     = useState(INIT_RECURRING);
  const [budgets,       setBudgets]       = useState({});

  // Transazioni complete = storico hardcoded (meno quelle cancellate) + nuove dell'utente
  const transactions = useMemo(() => [
    ...INIT_TRANSACTIONS.filter(t => !deletedIds.includes(t.id)),
    ...userTxs,
  ], [userTxs, deletedIds]);

  // Wrapper per compatibilità con tutto il codice che usa setTransactions
  const historicIds = useMemo(() => new Set(INIT_TRANSACTIONS.map(t => t.id)), []);

  const setTransactions = React.useCallback((updater) => {
    const current = [
      ...INIT_TRANSACTIONS.filter(t => !deletedIds.includes(t.id)),
      ...userTxs,
    ];
    const next = typeof updater === "function" ? updater(current) : updater;
    const nextIds = new Set(next.map(t => t.id));
    // userTxs = tutto ciò che non è nello storico originale
    const newUserTxs = next.filter(t => !historicIds.has(t.id));
    // deletedIds = storici che non compaiono più nel risultato
    const newDeletedIds = INIT_TRANSACTIONS.filter(t => !nextIds.has(t.id)).map(t => t.id);
    setUserTxs(newUserTxs);
    setDeletedIds(newDeletedIds);
  }, [userTxs, deletedIds, historicIds]);

  // ── Storage ──────────────────────────────────────────────────────────────
  React.useEffect(() => { setLoaded(true); }, []);

  const [tab,          setTab]          = useState("dashboard");
  const [filterMonth,  setFilterMonth]  = useState(now.getMonth());
  const [filterYear,   setFilterYear]   = useState(now.getFullYear());
  const [filterMember, setFilterMember] = useState("all");
  const [modal,        setModal]        = useState(null);
  const [editTx,       setEditTx]       = useState(null);

  const activeMember = members.find(m => m.id === currentMember) || members[0];
  const allCats = [...categories.out, ...categories.in];

  const realTx = useMemo(() => transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === filterMonth && d.getFullYear() === filterYear &&
           (filterMember === "all" || t.memberId === filterMember);
  }), [transactions, filterMonth, filterYear, filterMember]);

  const MONTHS_WITH_HISTORY = new Set(HISTORICAL_TRANSACTIONS.map(t => t.date.slice(0,7)));

  const recTx = useMemo(() => {
    const monthKey = `${filterYear}-${String(filterMonth+1).padStart(2,"0")}`;
    if (MONTHS_WITH_HISTORY.has(monthKey)) return [];
    return recurring
      .filter(r => r.active && (filterMember === "all" || r.memberId === filterMember))
      .map(r => ({
        id: `__rec__${r.id}`, type:"out", amount:r.amount, categoryId:r.categoryId,
        note:r.name, date:`${filterYear}-${String(filterMonth+1).padStart(2,"0")}-01`,
        memberId:r.memberId, isRecurring:true,
      }));
  }, [recurring, filterMonth, filterYear, filterMember]);

  const allTx    = useMemo(() => [...recTx, ...realTx], [recTx, realTx]);
  const totalIn  = useMemo(() => allTx.filter(t=>t.type==="in").reduce((s,t)=>s+t.amount,0), [allTx]);
  const totalOut = useMemo(() => allTx.filter(t=>t.type==="out").reduce((s,t)=>s+t.amount,0), [allTx]);
  const balance  = totalIn - totalOut;

  const byCategory = useMemo(() => {
    const m = {};
    allTx.filter(t=>t.type==="out").forEach(t => { m[t.categoryId]=(m[t.categoryId]||0)+t.amount; });
    return m;
  }, [allTx]);

  const byCategoryIn = useMemo(() => {
    const m = {};
    allTx.filter(t=>t.type==="in").forEach(t => { m[t.categoryId]=(m[t.categoryId]||0)+t.amount; });
    return m;
  }, [allTx]);

  if (!loaded) return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",
      justifyContent:"center",flexDirection:"column",gap:16,fontFamily:SF}}>
      <div style={{width:60,height:60,borderRadius:16,background:"linear-gradient(135deg,#0a84ff,#5e5ce6)",
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>💰</div>
      <p style={{margin:0,color:C.textSec,fontSize:14}}>Caricamento...</p>
    </div>
  );

  // Demo pubblica — pagina PIN rimossa
  if (page === "login") return <LoginPage members={members} onLogin={id=>{setCurrentMember(id);setPage("app");}} onAddMember={m=>setMembers(ms=>[...ms,m])}/>;

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:SF,
      maxWidth:430,margin:"0 auto",WebkitFontSmoothing:"antialiased"}}>

      {/* ── Header ── */}
      <header style={{padding:"54px 22px 0",display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
        <div>
          <p style={{margin:0,fontSize:13,color:C.textSec,fontWeight:500}}>
            {activeMember.avatar} {activeMember.name}
          </p>
          <h1 style={{margin:"3px 0 0",fontSize:30,fontWeight:700,letterSpacing:-0.8,lineHeight:1.1}}>
            {MONTHS[filterMonth]}<span style={{color:C.textSec,fontWeight:400}}> {filterYear}</span>
          </h1>
        </div>
        <button onClick={()=>setPage("login")} style={{
          background:C.glassMd,backdropFilter:"blur(20px)",
          border:`0.5px solid ${C.borderHi}`,borderRadius:20,
          padding:"7px 14px",color:C.textSec,cursor:"pointer",
          fontSize:13,fontWeight:500,marginTop:8,
        }}>Esci</button>
      </header>

      {/* ── Selettore mese ── */}
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 22px 0"}}>
        <button onClick={()=>{if(filterMonth===0){setFilterMonth(11);setFilterYear(y=>y-1);}else setFilterMonth(m=>m-1);}}
          style={{width:34,height:34,borderRadius:"50%",background:C.glassMd,
            border:`0.5px solid ${C.borderHi}`,color:C.text,cursor:"pointer",
            fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>‹</button>
        {members.length > 1 && (
          <div style={{flex:1,display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>
            {[{id:"all",name:"Tutti",avatar:"👥"},...members].map(m=>(
              <button key={m.id} onClick={()=>setFilterMember(m.id)} style={{
                padding:"5px 12px",borderRadius:20,border:"none",cursor:"pointer",
                fontSize:12,fontWeight:600,transition:"all 0.2s",
                background:filterMember===m.id?C.accent:C.glass,
                color:filterMember===m.id?"#fff":C.textSec,
              }}>{m.avatar} {m.name}</button>
            ))}
          </div>
        )}
        {members.length <= 1 && <div style={{flex:1}}/>}
        <button onClick={()=>{if(filterMonth===11){setFilterMonth(0);setFilterYear(y=>y+1);}else setFilterMonth(m=>m+1);}}
          style={{width:34,height:34,borderRadius:"50%",background:C.glassMd,
            border:`0.5px solid ${C.borderHi}`,color:C.text,cursor:"pointer",
            fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>›</button>
      </div>

      <div style={{height:18}}/>

      {/* ── Pagine ── */}
      <div style={{padding:"0 16px 130px"}}>
        {tab==="dashboard"    && <DashboardV2 totalIn={totalIn} totalOut={totalOut} balance={balance}
          allTx={allTx} byCategory={byCategory} allCats={allCats} members={members}
          transactions={transactions} recurring={recurring} members={members}
          filterMonth={filterMonth} filterYear={filterYear}/>}
        {tab==="transactions" && <TransactionsV2 allTx={allTx} allCats={allCats} members={members}
          onDelete={id=>setTransactions(ts=>ts.filter(t=>t.id!==id))}
          onEdit={tx=>{setEditTx(tx);setModal("edit");}}/>}
        {tab==="stats"        && <Stats allTx={allTx} byCategory={byCategory} allCats={allCats}
          totalIn={totalIn} totalOut={totalOut} transactions={transactions} recurring={recurring}
          members={members} filterMonth={filterMonth} filterYear={filterYear}/>}
        {tab==="budget"       && <BudgetPage budgets={budgets} setBudgets={setBudgets}
          categories={categories} byCategory={byCategory} byCategoryIn={byCategoryIn}
          transactions={transactions} recurring={recurring}
          filterMonth={filterMonth} filterYear={filterYear}/>}
        {tab==="recurring"    && <RecurringPage recurring={recurring} setRecurring={setRecurring}
          categories={categories} members={members} activeMember={activeMember}
          totalIn={totalIn} totalOut={totalOut}/>}
        {tab==="family"       && <FamilyPage members={members} setMembers={setMembers}
          transactions={transactions} filterMonth={filterMonth} filterYear={filterYear}
          currentMember={currentMember} setCurrentMember={setCurrentMember} recurring={recurring}
          userTxs={userTxs} deletedIds={deletedIds} budgets={budgets} allCats={allCats}
          setUserTxs={setUserTxs} setDeletedIds={setDeletedIds} setRecurring={setRecurring}
          setBudgets={setBudgets} setMembers2={setMembers} setCurrentMember2={setCurrentMember}/>}
      </div>

      {/* ── Bottom Nav Apple-style ── */}
      <nav style={{
        position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
        width:"100%",maxWidth:430,
        background:"rgba(14,14,16,0.85)",
        backdropFilter:"blur(40px) saturate(200%)",
        WebkitBackdropFilter:"blur(40px) saturate(200%)",
        borderTop:"0.5px solid rgba(255,255,255,0.1)",
        display:"flex",alignItems:"center",
        padding:"10px 4px calc(10px + env(safe-area-inset-bottom,0px))",
        zIndex:100,
      }}>
        {[
          {id:"dashboard",  label:"Home",      icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1v-9.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M9 21v-8h6v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>},
          {id:"transactions",label:"Movimenti", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2.5" y="6.5" width="19" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="M2.5 10.5h19" stroke="currentColor" strokeWidth="1.6"/><circle cx="7" cy="15" r="1.2" fill="currentColor"/></svg>},
          {id:"stats",      label:"Grafici",   icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M9 20V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M14 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M19 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>},
        ].map(({id,label,icon}) => (
          <button key={id} onClick={()=>setTab(id)} style={{
            flex:1,padding:"2px 2px 4px",border:"none",cursor:"pointer",
            background:"transparent",
            color:tab===id?C.accent:"rgba(255,255,255,0.32)",
            display:"flex",flexDirection:"column",alignItems:"center",gap:4,
            transition:"color 0.15s",
          }}>
            {icon}
            <span style={{fontSize:10,fontWeight:tab===id?600:400,letterSpacing:-0.1}}>{label}</span>
          </button>
        ))}

        {/* FAB */}
        <div style={{flex:"0 0 64px",display:"flex",justifyContent:"center",alignItems:"center",position:"relative"}}>
          {modal==="fab_menu" && (
            <>
              <div onClick={()=>setModal(null)} style={{position:"fixed",inset:0,zIndex:98}}/>
              <div style={{
                position:"absolute",bottom:62,left:"50%",transform:"translateX(-50%)",
                background:"rgba(30,30,34,0.98)",backdropFilter:"blur(40px)",
                border:"0.5px solid rgba(255,255,255,0.12)",
                borderRadius:20,overflow:"hidden",zIndex:99,
                boxShadow:"0 20px 60px rgba(0,0,0,0.7)",width:170,
              }}>
                <button onClick={()=>setModal("add_in")} style={{
                  width:"100%",padding:"14px 16px",border:"none",background:"transparent",
                  cursor:"pointer",display:"flex",alignItems:"center",gap:12,color:C.text,
                }}>
                  <div style={{width:36,height:36,borderRadius:10,background:C.greenDim,
                    display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke={C.green} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div style={{textAlign:"left"}}>
                    <p style={{margin:0,fontSize:14,fontWeight:600}}>Entrata</p>
                    <p style={{margin:0,fontSize:11,color:C.textSec}}>Aggiungi</p>
                  </div>
                </button>
                <div style={{height:"0.5px",background:"rgba(255,255,255,0.07)"}}/>
                <button onClick={()=>setModal("add_out")} style={{
                  width:"100%",padding:"14px 16px",border:"none",background:"transparent",
                  cursor:"pointer",display:"flex",alignItems:"center",gap:12,color:C.text,
                }}>
                  <div style={{width:36,height:36,borderRadius:10,background:C.redDim,
                    display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M19 12l-7 7-7-7" stroke={C.red} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div style={{textAlign:"left"}}>
                    <p style={{margin:0,fontSize:14,fontWeight:600}}>Uscita</p>
                    <p style={{margin:0,fontSize:11,color:C.textSec}}>Aggiungi</p>
                  </div>
                </button>
              </div>
            </>
          )}
          <button onClick={()=>setModal(modal==="fab_menu"?null:"fab_menu")} style={{
            width:48,height:48,borderRadius:"50%",border:"none",
            background:modal==="fab_menu"?"rgba(255,255,255,0.1)":C.accent,
            color:"#fff",fontSize:26,fontWeight:300,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:modal==="fab_menu"?"none":`0 6px 24px ${C.accent}55`,
            transform:modal==="fab_menu"?"rotate(45deg) scale(0.9)":"rotate(0) scale(1)",
            transition:"all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
            position:"relative",bottom:8,
          }}>+</button>
        </div>

        {[
          {id:"budget",   label:"Budget",    icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M12 8v4l2.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>},
          {id:"recurring",label:"Fissi",     icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M20 12a8 8 0 01-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M4 8V4h4M20 16v4h-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>},
          {id:"family",   label:"Famiglia",  icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="8.5" cy="7" r="3" stroke="currentColor" strokeWidth="1.6"/><circle cx="16" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M2 19c0-3 2.9-5 6.5-5s6.5 2 6.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M16 11c2.3 0 4 1.4 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>},
        ].map(({id,label,icon}) => (
          <button key={id} onClick={()=>setTab(id)} style={{
            flex:1,padding:"2px 2px 4px",border:"none",cursor:"pointer",
            background:"transparent",
            color:tab===id?C.accent:"rgba(255,255,255,0.32)",
            display:"flex",flexDirection:"column",alignItems:"center",gap:4,
            transition:"color 0.15s",
          }}>
            {icon}
            <span style={{fontSize:10,fontWeight:tab===id?600:400,letterSpacing:-0.1}}>{label}</span>
          </button>
        ))}
      </nav>

      {(modal==="add_out"||modal==="add_in"||modal==="add"||modal==="edit") && (
        <TxModal tx={modal==="edit"?editTx:null} defaultType={modal==="add_in"?"in":"out"}
          categories={categories} members={members} activeMember={activeMember}
          onClose={()=>{setModal(null);setEditTx(null);}}
          onSave={tx=>{
            if(modal==="edit") setTransactions(ts=>ts.map(t=>t.id===tx.id?tx:t));
            else setTransactions(ts=>[tx,...ts]);
            setModal(null); setEditTx(null);
          }}
          onClose={()=>{setModal(null);setEditTx(null);}}/>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// PIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
function PinPage({ correctPin, onSuccess }) {
  const [pin, setPin] = React.useState("");
  const [error, setError] = React.useState(false);
  const [shake, setShake] = React.useState(false);

  const handleDigit = (d) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    setError(false);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === correctPin) {
          onSuccess();
        } else {
          setError(true);
          setShake(true);
          setTimeout(() => { setPin(""); setShake(false); }, 600);
        }
      }, 120);
    }
  };

  const handleDelete = () => { setPin(p => p.slice(0,-1)); setError(false); };

  const digits = [[1,2,3],[4,5,6],[7,8,9],[null,0,"⌫"]];

  return (
    <div style={{
      minHeight:"100vh", background:C.bg,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:"40px 24px", fontFamily:SF,
      WebkitFontSmoothing:"antialiased",
    }}>
      {/* Logo */}
      <div style={{
        width:72,height:72,borderRadius:20,
        background:"linear-gradient(150deg,#0a84ff,#5e5ce6)",
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:36,marginBottom:20,
        boxShadow:"0 16px 48px rgba(10,132,255,0.35)",
      }}>💰</div>

      <h1 style={{margin:"0 0 4px",fontSize:26,fontWeight:700,letterSpacing:-0.5}}>FamilyFinance</h1>
      <p style={{margin:"0 0 36px",color:C.textSec,fontSize:14}}>Inserisci il PIN per accedere</p>

      {/* Pallini PIN */}
      <div style={{
        display:"flex", gap:16, marginBottom:40,
        transform: shake ? "translateX(0)" : "none",
        animation: shake ? "shake 0.5s ease" : "none",
      }}>
        <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-8px)}80%{transform:translateX(8px)}}`}</style>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            width:16, height:16, borderRadius:"50%",
            transition:"all 0.15s",
            background: error ? C.red
                       : i < pin.length ? C.accent
                       : "rgba(255,255,255,0.15)",
            transform: i < pin.length ? "scale(1.1)" : "scale(1)",
            boxShadow: i < pin.length && !error ? `0 0 12px ${C.accent}88` : "none",
          }}/>
        ))}
      </div>

      {/* Tastiera numerica */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,width:240}}>
        {digits.flat().map((d, i) => {
          if (d === null) return <div key={i}/>;
          const isDel = d === "⌫";
          return (
            <button key={i} onClick={() => isDel ? handleDelete() : handleDigit(String(d))}
              style={{
                height:64, borderRadius:16,
                border: "0.5px solid rgba(255,255,255,0.1)",
                background: isDel ? "transparent" : C.glassMd,
                backdropFilter:"blur(20px)",
                color: C.text, fontSize: isDel ? 20 : 24,
                fontWeight: isDel ? 400 : 300,
                cursor:"pointer",
                transition:"all 0.1s",
                fontFamily: SF,
              }}
              onMouseDown={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
              onMouseUp={e => e.currentTarget.style.background = isDel ? "transparent" : C.glassMd}
              onTouchStart={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
              onTouchEnd={e => e.currentTarget.style.background = isDel ? "transparent" : C.glassMd}
            >
              {d}
            </button>
          );
        })}
      </div>

      {error && (
        <p style={{marginTop:20,color:C.red,fontSize:13,fontWeight:500}}>PIN non corretto</p>
      )}
    </div>
  );
}

function LoginPage({ members, onLogin, onAddMember }) {
  const [adding, setAdding] = useState(false);
  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",padding:"40px 24px",fontFamily:SF,
      WebkitFontSmoothing:"antialiased"}}>
      <div style={{
        width:90,height:90,borderRadius:26,
        background:"linear-gradient(150deg,#0a84ff,#5e5ce6)",
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:44,marginBottom:22,
        boxShadow:"0 24px 64px rgba(10,132,255,0.35), 0 0 0 1px rgba(255,255,255,0.06)",
      }}>💰</div>
      <h1 style={{margin:"0 0 4px",fontSize:30,fontWeight:700,letterSpacing:-0.8}}>FamilyFinance</h1>
      <p style={{margin:"0 0 36px",color:C.textSec,fontSize:15}}>Seleziona il tuo profilo</p>
      <div style={{width:"100%",maxWidth:340}}>
        {members.map(m=>(
          <button key={m.id} onClick={()=>onLogin(m.id)} style={{
            width:"100%",padding:"15px 18px",marginBottom:10,
            borderRadius:18,border:`0.5px solid ${C.borderHi}`,
            background:C.card,backdropFilter:"blur(20px)",
            color:C.text,cursor:"pointer",
            display:"flex",alignItems:"center",gap:14,
          }}>
            <div style={{width:48,height:48,borderRadius:14,flexShrink:0,
              background:`linear-gradient(135deg,${m.color||C.accent}22,${m.color||C.accent}44)`,
              border:`1px solid ${m.color||C.accent}33`,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>
              {m.avatar}
            </div>
            <div style={{flex:1,textAlign:"left"}}>
              <p style={{margin:0,fontSize:16,fontWeight:600}}>{m.name}</p>
              <p style={{margin:0,fontSize:12,color:C.textSec}}>Tocca per accedere</p>
            </div>
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M1 1l6 6-6 6" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
        {!adding
          ? <button onClick={()=>setAdding(true)} style={{
              width:"100%",padding:"14px 18px",borderRadius:18,
              border:"0.5px dashed rgba(255,255,255,0.18)",background:"transparent",
              color:C.textSec,cursor:"pointer",fontSize:14,fontWeight:500,
              display:"flex",alignItems:"center",justifyContent:"center",gap:6,
            }}>
              <span style={{fontSize:18}}>+</span> Aggiungi membro
            </button>
          : <MemberForm onSave={m=>{onAddMember(m);setAdding(false);}} onClose={()=>setAdding(false)}/>
        }
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD V2
// ─────────────────────────────────────────────────────────────────────────────
function DashboardV2({ totalIn, totalOut, balance, allTx, byCategory, allCats, transactions, recurring, filterMonth, filterYear }) {
  const [expanded, setExpanded] = React.useState({});
  const toggle = id => setExpanded(e=>({...e,[id]:!e[id]}));

  const sparkData = React.useMemo(()=>{
    const ins=[], outs=[];
    for(let i=6;i>=0;i--){
      let m=filterMonth-i, y=filterYear;
      while(m<0){m+=12;y--;}
      const txs=transactions.filter(t=>{const d=new Date(t.date);return d.getMonth()===m&&d.getFullYear()===y;});
      const recAmt=recurring.filter(r=>r.active).reduce((s,r)=>s+r.amount,0);
      ins.push(txs.filter(t=>t.type==="in").reduce((s,t)=>s+t.amount,0));
      outs.push(txs.filter(t=>t.type==="out").reduce((s,t)=>s+t.amount,0)+recAmt);
    }
    return {ins,outs};
  },[transactions,recurring,filterMonth,filterYear]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>

      {/* ── Hero card saldo ── */}
      <div style={{
        borderRadius:28,padding:"26px 22px 22px",position:"relative",overflow:"hidden",
        background:"linear-gradient(145deg,#0b1a30 0%,#0d1f3c 50%,#080810 100%)",
        border:"0.5px solid rgba(10,132,255,0.22)",
        boxShadow:"0 24px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}>
        <div style={{position:"absolute",top:-50,left:-30,width:200,height:200,borderRadius:"50%",
          background:"rgba(10,132,255,0.1)",filter:"blur(60px)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-30,right:-20,width:160,height:160,borderRadius:"50%",
          background:"rgba(94,92,230,0.08)",filter:"blur(48px)",pointerEvents:"none"}}/>
        <p style={{margin:0,color:"rgba(255,255,255,0.38)",fontSize:11,fontWeight:600,letterSpacing:0.8,textTransform:"uppercase"}}>
          Saldo del mese
        </p>
        <p style={{margin:"5px 0 0",fontSize:42,fontWeight:700,letterSpacing:-2,lineHeight:1,
          color:balance>=0?"#fff":C.red}}>
          {balance>=0?"+":""}{fmt(balance)}
        </p>
        {(totalIn+totalOut)>0 && (
          <div style={{margin:"18px 0 16px",height:2.5,borderRadius:2,background:"rgba(255,255,255,0.07)",overflow:"hidden"}}>
            <div style={{height:"100%",borderRadius:2,
              width:`${Math.min((totalIn/(totalIn+totalOut))*100,100)}%`,
              background:"linear-gradient(90deg,#30d158,#1eb84a)"}}/>
          </div>
        )}
        <div style={{display:"flex",gap:0}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:C.green}}/>
              <span style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.38)",letterSpacing:0.6}}>ENTRATE</span>
            </div>
            <p style={{margin:0,fontSize:20,fontWeight:700,color:C.green,letterSpacing:-0.5}}>+{fmt(totalIn)}</p>
            <div style={{marginTop:7}}><Sparkline points={sparkData.ins} color={C.green} width={82} height={26}/></div>
          </div>
          <div style={{width:"0.5px",background:"rgba(255,255,255,0.08)",margin:"0 16px"}}/>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:C.red}}/>
              <span style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.38)",letterSpacing:0.6}}>USCITE</span>
            </div>
            <p style={{margin:0,fontSize:20,fontWeight:700,color:C.red,letterSpacing:-0.5}}>-{fmt(totalOut)}</p>
            <div style={{marginTop:7}}><Sparkline points={sparkData.outs} color={C.red} width={82} height={26}/></div>
          </div>
        </div>
      </div>

      {/* ── Spese per categoria ── */}
      {Object.keys(byCategory).length > 0 && (
        <div style={{background:C.card,border:`0.5px solid ${C.borderHi}`,borderRadius:24,padding:"18px 16px"}}>
          <p style={{margin:"0 0 14px",fontSize:13,fontWeight:600,color:C.textSec,letterSpacing:0.1}}>
            Spese per categoria
          </p>
          {Object.entries(byCategory).sort((a,b)=>b[1]-a[1]).map(([catId,amount])=>{
            const cat = allCats.find(c=>c.id===catId)||{name:"Altro",icon:"📦",color:C.muted};
            const pct = totalOut>0?(amount/totalOut)*100:0;
            const isOpen = !!expanded[catId];
            const txList = allTx.filter(t=>t.type==="out"&&t.categoryId===catId).sort((a,b)=>new Date(b.date)-new Date(a.date));
            return (
              <div key={catId} style={{marginBottom:10}}>
                <button onClick={()=>toggle(catId)} style={{
                  width:"100%",background:"transparent",border:"none",cursor:"pointer",padding:0,textAlign:"left"
                }}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                    <div style={{width:34,height:34,borderRadius:10,flexShrink:0,
                      background:`${cat.color}18`,border:`0.5px solid ${cat.color}30`,
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>
                      {cat.icon}
                    </div>
                    <span style={{flex:1,fontSize:14,fontWeight:500,color:C.text}}>{cat.name}</span>
                    <span style={{fontSize:14,fontWeight:700,color:C.text,letterSpacing:-0.3}}>{fmt(amount)}</span>
                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" style={{
                      transition:"transform 0.2s",transform:isOpen?"rotate(90deg)":"rotate(0deg)",marginLeft:4}}>
                      <path d="M1 1l5 5-5 5" stroke={C.muted} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div style={{height:3,background:"rgba(255,255,255,0.06)",borderRadius:2,overflow:"hidden",marginLeft:44}}>
                    <div style={{height:"100%",width:`${pct}%`,background:cat.color,borderRadius:2,opacity:0.8}}/>
                  </div>
                </button>
                {isOpen && (
                  <div style={{marginTop:8,marginLeft:44,borderLeft:`1.5px solid ${cat.color}30`,paddingLeft:12}}>
                    {txList.slice(0,8).map(t=>(
                      <div key={t.id} style={{display:"flex",justifyContent:"space-between",
                        alignItems:"center",padding:"6px 0",
                        borderBottom:"0.5px solid rgba(255,255,255,0.04)"}}>
                        <div>
                          <p style={{margin:0,fontSize:13,fontWeight:500}}>{t.note||cat.name}</p>
                          <p style={{margin:0,fontSize:11,color:C.textSec}}>{t.date}</p>
                        </div>
                        <span style={{fontSize:13,fontWeight:600,color:C.red}}>{fmt(t.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Ultime transazioni ── */}
      {allTx.length>0 && (
        <div style={{background:C.card,border:`0.5px solid ${C.borderHi}`,borderRadius:24,padding:"18px 16px"}}>
          <p style={{margin:"0 0 14px",fontSize:13,fontWeight:600,color:C.textSec}}>Ultimi movimenti</p>
          {allTx.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5).map(t=>{
            const cat = allCats.find(c=>c.id===t.categoryId)||{name:"Altro",icon:"📦",color:C.muted};
            return (
              <div key={t.id} style={{display:"flex",alignItems:"center",gap:12,
                padding:"10px 0",borderBottom:"0.5px solid rgba(255,255,255,0.05)"}}>
                <div style={{width:38,height:38,borderRadius:11,flexShrink:0,
                  background:`${cat.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>
                  {cat.icon}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{margin:0,fontSize:14,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.note||cat.name}</p>
                  <p style={{margin:0,fontSize:11,color:C.textSec}}>{cat.name} · {t.date}</p>
                </div>
                <AmountBadge amount={t.amount} type={t.type}/>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TRANSACTIONS V2
// ─────────────────────────────────────────────────────────────────────────────
function TransactionsV2({ allTx, allCats, members, onDelete, onEdit }) {
  const [search, setSearch] = useState("");
  const sorted = allTx.slice().sort((a,b)=>new Date(b.date)-new Date(a.date));
  const filtered = search ? sorted.filter(t=>
    (t.note||"").toLowerCase().includes(search.toLowerCase()) ||
    (allCats.find(c=>c.id===t.categoryId)?.name||"").toLowerCase().includes(search.toLowerCase())
  ) : sorted;

  return (
    <div>
      {/* Search bar Apple-style */}
      <div style={{position:"relative",marginBottom:14}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{
          position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}>
          <circle cx="11" cy="11" r="7" stroke={C.textSec} strokeWidth="2"/>
          <path d="M16.5 16.5L21 21" stroke={C.textSec} strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Cerca movimenti..."
          style={{width:"100%",padding:"11px 14px 11px 40px",borderRadius:14,
            border:`0.5px solid ${C.borderHi}`,background:C.glassMd,
            backdropFilter:"blur(20px)",color:C.text,fontSize:14,
            outline:"none",boxSizing:"border-box"}}/>
      </div>
      <div style={{background:C.card,border:`0.5px solid ${C.borderHi}`,borderRadius:24,overflow:"hidden"}}>
        {filtered.length===0 && (
          <div style={{padding:32,textAlign:"center",color:C.textSec,fontSize:14}}>
            Nessun movimento trovato
          </div>
        )}
        {filtered.map((t,i)=>{
          const cat = allCats.find(c=>c.id===t.categoryId)||{name:"Altro",icon:"📦",color:C.muted};
          return (
            <div key={t.id} style={{
              display:"flex",alignItems:"center",gap:12,padding:"12px 16px",
              borderBottom:i<filtered.length-1?"0.5px solid rgba(255,255,255,0.05)":"none",
            }}>
              <div style={{width:40,height:40,borderRadius:12,flexShrink:0,
                background:`${cat.color}18`,border:`0.5px solid ${cat.color}25`,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>
                {cat.icon}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{margin:0,fontSize:14,fontWeight:500,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {t.note||cat.name}
                </p>
                <p style={{margin:0,fontSize:11,color:C.textSec}}>{cat.name} · {t.date}</p>
              </div>
              <AmountBadge amount={t.amount} type={t.type}/>
              {!t.isRecurring && (
                <button onClick={()=>onDelete(t.id)} style={{
                  width:28,height:28,borderRadius:8,border:"none",
                  background:"rgba(255,69,58,0.12)",color:C.red,
                  cursor:"pointer",fontSize:14,flexShrink:0,
                  display:"flex",alignItems:"center",justifyContent:"center",
                }}>×</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


function PieChart({ data, size=180 }) {
  if (!data.length) return null;
  const total = data.reduce((s,d)=>s+d.value,0);
  if (total===0) return null;
  const cx=size/2, cy=size/2, r=size/2-10, innerR=r*0.52;
  let angle=-Math.PI/2;
  const slices = data.map(d=>{
    const sweep=(d.value/total)*2*Math.PI;
    const x1=cx+r*Math.cos(angle), y1=cy+r*Math.sin(angle);
    angle+=sweep;
    const x2=cx+r*Math.cos(angle), y2=cy+r*Math.sin(angle);
    const large=sweep>Math.PI?1:0;
    const ix1=cx+innerR*Math.cos(angle-sweep), iy1=cy+innerR*Math.sin(angle-sweep);
    const ix2=cx+innerR*Math.cos(angle), iy2=cy+innerR*Math.sin(angle);
    return {path:`M${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} L${ix2},${iy2} A${innerR},${innerR} 0 ${large},0 ${ix1},${iy1} Z`,
      color:d.color, label:d.label, value:d.value, pct:((d.value/total)*100).toFixed(1)};
  });
  return (
    <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
      <svg width={size} height={size} style={{flexShrink:0}}>
        {slices.map((s,i)=><path key={i} d={s.path} fill={s.color} opacity={0.85}/>)}
      </svg>
      <div style={{flex:1,minWidth:120}}>
        {slices.filter(s=>parseFloat(s.pct)>1).sort((a,b)=>b.value-a.value).map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
            <div style={{width:10,height:10,borderRadius:2,background:s.color,flexShrink:0}}/>
            <span style={{fontSize:11,color:C.text,flex:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.label}</span>
            <span style={{fontSize:11,color:C.muted,flexShrink:0}}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stats({ allTx, byCategory, allCats, members, filterMonth, filterYear, transactions, recurring, totalIn, totalOut }) {

  const trend = useMemo(()=>{
    const res=[];
    for(let i=5;i>=0;i--){
      let m=filterMonth-i, y=filterYear;
      while(m<0){m+=12;y--;}
      const txs=transactions.filter(t=>{const d=new Date(t.date);return d.getMonth()===m&&d.getFullYear()===y;});
      const recAmt=recurring.filter(r=>r.active).reduce((s,r)=>s+r.amount,0);
      const inc=txs.filter(t=>t.type==="in").reduce((s,t)=>s+t.amount,0);
      const exp=txs.filter(t=>t.type==="out").reduce((s,t)=>s+t.amount,0)+recAmt;
      res.push({label:MONTHS[m].slice(0,3),inc,exp});
    }
    return res;
  },[transactions,recurring,filterMonth,filterYear]);

  const maxVal = Math.max(...trend.map(t=>Math.max(t.inc,t.exp)),1);

  return (
    <div>
      <h2 style={{margin:"0 0 16px",fontSize:18,fontWeight:700}}>Statistiche</h2>
      <div style={{background:C.card,borderRadius:20,padding:20,marginBottom:16}}>
        <p style={{margin:"0 0 16px",fontSize:12,fontWeight:700,color:C.muted,letterSpacing:1,textTransform:"uppercase"}}>Ultimi 6 mesi</p>
        <div style={{display:"flex",alignItems:"flex-end",gap:8,height:120}}>
          {trend.map((t,i)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{width:"100%",display:"flex",gap:2,alignItems:"flex-end",height:100}}>
                <div style={{flex:1,borderRadius:"4px 4px 0 0",background:C.green,height:`${(t.inc/maxVal)*100}%`,minHeight:t.inc>0?4:0,opacity:0.7}}/>
                <div style={{flex:1,borderRadius:"4px 4px 0 0",background:C.red,height:`${(t.exp/maxVal)*100}%`,minHeight:t.exp>0?4:0,opacity:0.7}}/>
              </div>
              <span style={{fontSize:10,color:C.muted}}>{t.label}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:16,marginTop:12}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:2,background:C.green,opacity:0.7}}/><span style={{fontSize:12,color:C.muted}}>Entrate</span></div>
          <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:2,background:C.red,opacity:0.7}}/><span style={{fontSize:12,color:C.muted}}>Uscite</span></div>
        </div>
      </div>

      {Object.entries(byCategory).length > 0 && (
        <div style={{background:C.card,borderRadius:20,padding:20,marginBottom:16}}>
          <p style={{margin:"0 0 16px",fontSize:12,fontWeight:700,color:C.muted,letterSpacing:1,textTransform:"uppercase"}}>Grafico spese</p>
          <PieChart data={Object.entries(byCategory).map(([catId,value])=>{
            const cat=allCats.find(c=>c.id===catId)||{name:"Altro",color:C.muted};
            return {label:cat.name,value,color:cat.color};
          })} size={180}/>
        </div>
      )}

      {Object.entries(byCategory).length > 0 && (
        <div style={{background:C.card,borderRadius:20,padding:20,marginBottom:16}}>
          <p style={{margin:"0 0 16px",fontSize:12,fontWeight:700,color:C.muted,letterSpacing:1,textTransform:"uppercase"}}>Distribuzione spese</p>
          {Object.entries(byCategory).sort((a,b)=>b[1]-a[1]).map(([catId,amount])=>{
            const cat=allCats.find(c=>c.id===catId)||{name:"Altro",icon:"📦",color:C.muted};
            const pct=totalOut>0?((amount/totalOut)*100).toFixed(1):0;
            return (
              <div key={catId} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                <div style={{width:36,height:36,borderRadius:10,background:`${cat.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{cat.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:13,fontWeight:600}}>{cat.name}</span>
                    <span style={{fontSize:13,color:C.muted}}>{pct}%</span>
                  </div>
                  <div style={{height:4,background:C.bg,borderRadius:2}}>
                    <div style={{height:"100%",width:`${pct}%`,background:cat.color,borderRadius:2}}/>
                  </div>
                </div>
                <span style={{fontSize:13,fontWeight:700,minWidth:70,textAlign:"right"}}>{fmt(amount)}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Andamento saldo netto cumulativo */}
      {(() => {
        const netPoints = [];
        for (let i=11; i>=0; i--) {
          let m=filterMonth-i, y=filterYear;
          while(m<0){m+=12;y--;}
          const txs=transactions.filter(t=>{const d=new Date(t.date);return d.getMonth()===m&&d.getFullYear()===y;});
          const recAmt=recurring.filter(r=>r.active).reduce((s,r)=>s+r.amount,0);
          const inc=txs.filter(t=>t.type==="in").reduce((s,t)=>s+t.amount,0);
          const exp=txs.filter(t=>t.type==="out").reduce((s,t)=>s+t.amount,0)+recAmt;
          netPoints.push({label:MONTHS[m].slice(0,3)+String(y).slice(2), net:inc-exp, inc, exp});
        }
        const hasData = netPoints.some(p=>p.inc>0||p.exp>0);
        if (!hasData) return null;
        const nets = netPoints.map(p=>p.net);
        const maxAbs = Math.max(...nets.map(Math.abs), 1);
        const W=300, H=80, pad=8;
        const xs = nets.map((_,i)=> pad + (i/(nets.length-1))*(W-pad*2));
        const ys = nets.map(v=> H/2 - (v/maxAbs)*(H/2-6));
        const linePath = xs.map((x,i)=>`${i===0?"M":"L"}${x},${ys[i]}`).join(" ");
        const zeroY = H/2;
        return (
          <div style={{background:C.card,borderRadius:20,padding:20,marginBottom:16}}>
            <p style={{margin:"0 0 4px",fontSize:12,fontWeight:700,color:C.muted,letterSpacing:1,textTransform:"uppercase"}}>Saldo netto — ultimi 12 mesi</p>
            <p style={{margin:"0 0 16px",fontSize:11,color:C.muted}}>Positivo = risparmio, negativo = deficit</p>
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible"}}>
              {/* Zero line */}
              <line x1={pad} y1={zeroY} x2={W-pad} y2={zeroY} stroke={C.border} strokeWidth="1" strokeDasharray="4,3"/>
              {/* Colored segments */}
              {nets.slice(0,-1).map((_,i)=>{
                const x1=xs[i],y1=ys[i],x2=xs[i+1],y2=ys[i+1];
                const col = nets[i]>=0 ? C.green : C.red;
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth="2" strokeLinecap="round" opacity="0.85"/>;
              })}
              {/* Dots */}
              {xs.map((x,i)=>(
                <circle key={i} cx={x} cy={ys[i]} r="3" fill={nets[i]>=0?C.green:C.red}/>
              ))}
            </svg>
            {/* Labels */}
            <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
              {netPoints.filter((_,i)=>i%2===0).map((p,i)=>(
                <span key={i} style={{fontSize:9,color:C.muted}}>{p.label}</span>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Top 5 spese singole del mese */}
      {(() => {
        const top5 = allTx.filter(t=>t.type==="out").sort((a,b)=>b.amount-a.amount).slice(0,5);
        if (!top5.length) return null;
        const maxAmt = top5[0].amount;
        return (
          <div style={{background:C.card,borderRadius:20,padding:20,marginBottom:16}}>
            <p style={{margin:"0 0 16px",fontSize:12,fontWeight:700,color:C.muted,letterSpacing:1,textTransform:"uppercase"}}>Top 5 spese del mese</p>
            {top5.map((tx,i)=>{
              const cat=allCats.find(c=>c.id===tx.categoryId)||{name:"Altro",icon:"📦",color:C.muted};
              const pct=(tx.amount/maxAmt)*100;
              return (
                <div key={tx.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <span style={{fontSize:13,fontWeight:800,color:C.muted,minWidth:16,textAlign:"center"}}>{i+1}</span>
                  <div style={{width:32,height:32,borderRadius:9,background:`${cat.color}22`,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>
                    {cat.icon}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                      <span style={{fontSize:13,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"60%"}}>
                        {tx.note||cat.name}{tx.isRecurring?" 🔄":""}
                      </span>
                      <span style={{fontSize:13,fontWeight:800,color:C.red}}>-{fmt(tx.amount)}</span>
                    </div>
                    <div style={{height:4,background:C.bg,borderRadius:2}}>
                      <div style={{height:"100%",width:`${pct}%`,background:cat.color,borderRadius:2,opacity:0.8}}/>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {members.length > 1 && (
        <div style={{background:C.card,borderRadius:20,padding:20}}>
          <p style={{margin:"0 0 16px",fontSize:12,fontWeight:700,color:C.muted,letterSpacing:1,textTransform:"uppercase"}}>Per membro</p>
          {members.map(m=>{
            const inc=allTx.filter(t=>t.type==="in"&&t.memberId===m.id).reduce((s,t)=>s+t.amount,0);
            const exp=allTx.filter(t=>t.type==="out"&&t.memberId===m.id).reduce((s,t)=>s+t.amount,0);
            return (
              <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                <span style={{fontSize:28}}>{m.avatar}</span>
                <div style={{flex:1}}>
                  <p style={{margin:0,fontSize:13,fontWeight:600}}>{m.name}</p>
                  <p style={{margin:0,fontSize:11,color:C.muted}}>
                    <span style={{color:C.green}}>+{fmt(inc)}</span> · <span style={{color:C.red}}>-{fmt(exp)}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BUDGET
// ─────────────────────────────────────────────────────────────────────────────
function BudgetPage({ budgets, setBudgets, categories, byCategory, byCategoryIn, transactions, recurring, filterMonth, filterYear }) {
  const [editing, setEditing] = useState(null);
  const [val, setVal] = useState("");
  const [incomeExpanded, setIncomeExpanded] = useState(false);

  const saveBudget = catId => {
    const n = parseFloat(val.replace(",","."));
    if (!isNaN(n)&&n>0) setBudgets(b=>({...b,[catId]:n}));
    setEditing(null); setVal("");
  };

  // Calcola spesa per categoria in un dato mese
  const spentInMonth = (catId, month, year) => {
    const recAmt = recurring.filter(r=>r.active&&r.categoryId===catId).reduce((s,r)=>s+r.amount,0);
    const txAmt  = transactions
      .filter(t=>{ const d=new Date(t.date); return t.type==="out"&&t.categoryId===catId&&d.getMonth()===month&&d.getFullYear()===year; })
      .reduce((s,t)=>s+t.amount,0);
    return txAmt + recAmt;
  };

  // Mese precedente
  const prevMonth = filterMonth===0 ? 11 : filterMonth-1;
  const prevYear  = filterMonth===0 ? filterYear-1 : filterYear;

  // Media storica: tutti i mesi con dati disponibili (escluso mese corrente)
  const allMonths = useMemo(()=>{
    const set = new Set();
    transactions.forEach(t=>{ const d=new Date(t.date); set.add(`${d.getFullYear()}-${d.getMonth()}`); });
    return [...set].filter(k => k!==`${filterYear}-${filterMonth}`);
  },[transactions, filterMonth, filterYear]);

  const avgSpent = (catId) => {
    if (allMonths.length===0) return null;
    const total = allMonths.reduce((s,k)=>{
      const [y,m]=k.split("-").map(Number);
      return s + spentInMonth(catId,m,y);
    },0);
    return total / allMonths.length;
  };

  // Spese: salire è rosso, scendere è verde
  const Delta = ({ current, reference, label }) => {
    if (reference == null || reference === 0) return <span style={{fontSize:11,color:C.muted}}>{label}: n/d</span>;
    const diff = ((current - reference) / reference) * 100;
    const up = diff > 0;
    return (
      <span style={{fontSize:11,color:up?C.red:C.green,display:"inline-flex",alignItems:"center",gap:2}}>
        {up?"▲":"▼"}{Math.abs(diff).toFixed(1)}% {label}
      </span>
    );
  };

  // Entrate: salire è verde, scendere è rosso
  const DeltaIncome = ({ current, reference }) => {
    if (!reference) return null;
    const diff = ((current - reference) / reference) * 100;
    const up = diff > 0;
    return (
      <span style={{fontSize:11,color:up?C.green:C.red,display:"inline-flex",alignItems:"center",gap:2}}>
        {up?"▲":"▼"}{Math.abs(diff).toFixed(1)}%
      </span>
    );
  };

  return (
    <div>
      <h2 style={{margin:"0 0 4px",fontSize:18,fontWeight:700}}>Budget mensile</h2>
      <p style={{margin:"0 0 16px",fontSize:13,color:C.muted}}>Confronto con mese precedente e media storica</p>
      {categories.out.map(cat=>{
        const spent    = byCategory[cat.id]||0;
        const budget   = budgets[cat.id];
        const pct      = budget?Math.min((spent/budget)*100,100):0;
        const over     = budget&&spent>budget;
        const prevAmt  = spentInMonth(cat.id, prevMonth, prevYear);
        const avg      = avgSpent(cat.id);

        return (
          <div key={cat.id} style={{background:C.card,borderRadius:16,padding:16,marginBottom:12}}>
            {/* Header */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:38,height:38,borderRadius:10,background:`${cat.color}22`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                  {cat.icon}
                </div>
                <div>
                  <p style={{margin:0,fontSize:14,fontWeight:600}}>{cat.name}</p>
                  <p style={{margin:0,fontSize:13,fontWeight:700,color:spent>0?C.text:C.muted}}>{fmt(spent)}</p>
                </div>
              </div>
              {editing===cat.id ? (
                <div style={{display:"flex",gap:6}}>
                  <input value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveBudget(cat.id)}
                    placeholder="es. 500" style={{width:80,padding:"6px 8px",borderRadius:8,border:`1px solid ${C.accent}`,background:C.bg,color:C.text,fontSize:13}} autoFocus/>
                  <button onClick={()=>saveBudget(cat.id)} style={{padding:"6px 10px",borderRadius:8,border:"none",background:C.accent,color:"#fff",cursor:"pointer"}}>✓</button>
                  <button onClick={()=>setEditing(null)} style={{padding:"6px 10px",borderRadius:8,border:"none",background:C.surface,color:C.muted,cursor:"pointer"}}>✗</button>
                </div>
              ) : (
                <button onClick={()=>{setEditing(cat.id);setVal(budget||"");}}
                  style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer",fontSize:12}}>
                  {budget?fmt(budget):"Budget"}
                </button>
              )}
            </div>

            {/* Barra budget */}
            {budget && (
              <div style={{marginBottom:8}}>
                <div style={{height:8,background:C.bg,borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${pct}%`,borderRadius:4,
                    background:over?C.red:pct>80?C.amber:C.green}}/>
                </div>
                <p style={{margin:"5px 0 0",fontSize:11,color:over?C.red:C.muted,textAlign:"right"}}>
                  {over?`⚠ Sforato di ${fmt(spent-budget)}`:`Rimanente: ${fmt(budget-spent)}`}
                </p>
              </div>
            )}

            {/* Scostamenti */}
            <div style={{display:"flex",gap:12,flexWrap:"wrap",
              borderTop:`1px solid ${C.border}`,paddingTop:8,marginTop:budget?0:4}}>
              <div style={{display:"flex",flexDirection:"column",gap:2}}>
                <span style={{fontSize:10,color:C.muted,letterSpacing:0.5,textTransform:"uppercase"}}>Mese prec.</span>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:12,color:C.muted}}>{fmt(prevAmt)}</span>
                  {spent>0||prevAmt>0 ? <Delta current={spent} reference={prevAmt||null} label="vs prec." /> : null}
                </div>
              </div>
              <div style={{width:1,background:C.border}}/>
              <div style={{display:"flex",flexDirection:"column",gap:2}}>
                <span style={{fontSize:10,color:C.muted,letterSpacing:0.5,textTransform:"uppercase"}}>Media storica</span>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:12,color:C.muted}}>{avg!=null?fmt(avg):"n/d"}</span>
                  {avg!=null&&(spent>0||avg>0) ? <Delta current={spent} reference={avg} label="vs media" /> : null}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ── ENTRATE raggruppate con espansione ── */}
      {(() => {
        const totalEarned = Object.values(byCategoryIn).reduce((s,v)=>s+v,0);
        const totalPrevEarned = transactions
          .filter(t=>{ const d=new Date(t.date); return t.type==="in"&&d.getMonth()===prevMonth&&d.getFullYear()===prevYear; })
          .reduce((s,t)=>s+t.amount,0);
        const totalAvgEarned = allMonths.length===0 ? null :
          allMonths.reduce((s,k)=>{
            const [y,m]=k.split("-").map(Number);
            return s + transactions.filter(t=>{ const d=new Date(t.date); return t.type==="in"&&d.getMonth()===m&&d.getFullYear()===y; }).reduce((s2,t)=>s2+t.amount,0);
          },0) / allMonths.length;

        const catRows = categories.in.map(cat=>{
          const earned = byCategoryIn[cat.id]||0;
          const prevEarned = transactions
            .filter(t=>{ const d=new Date(t.date); return t.type==="in"&&t.categoryId===cat.id&&d.getMonth()===prevMonth&&d.getFullYear()===prevYear; })
            .reduce((s,t)=>s+t.amount,0);
          const avgEarned = allMonths.length===0 ? null : allMonths.reduce((s,k)=>{
            const [y,m]=k.split("-").map(Number);
            return s + transactions.filter(t=>{ const d=new Date(t.date); return t.type==="in"&&t.categoryId===cat.id&&d.getMonth()===m&&d.getFullYear()===y; }).reduce((s2,t)=>s2+t.amount,0);
          },0) / allMonths.length;
          return {cat, earned, prevEarned, avgEarned};
        }).filter(r => r.earned>0 || r.prevEarned>0 || (r.avgEarned&&r.avgEarned>0));

        return (
          <div style={{marginTop:24}}>
            <h3 style={{margin:"0 0 4px",fontSize:15,fontWeight:700,color:C.text}}>Entrate</h3>
            <p style={{margin:"0 0 12px",fontSize:13,color:C.muted}}>Confronto totale entrate del mese</p>

            {/* Card totale entrate — cliccabile per espandere */}
            <div style={{background:C.card,borderRadius:16,marginBottom: incomeExpanded?0:0,
              borderBottomLeftRadius: incomeExpanded?0:16, borderBottomRightRadius: incomeExpanded?0:16}}>
              <button onClick={()=>setIncomeExpanded(e=>!e)}
                style={{width:"100%",background:"transparent",border:"none",cursor:"pointer",padding:16,textAlign:"left"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:42,height:42,borderRadius:12,background:"#4ade8022",
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                    💰
                  </div>
                  <div style={{flex:1}}>
                    <p style={{margin:0,fontSize:14,fontWeight:700,color:C.text}}>Totale entrate</p>
                    <p style={{margin:0,fontSize:18,fontWeight:800,color:C.green}}>+{fmt(totalEarned)}</p>
                  </div>
                  <span style={{fontSize:18,color:C.muted,transition:"transform 0.2s",
                    display:"inline-block", transform:incomeExpanded?"rotate(90deg)":"rotate(0deg)"}}>›</span>
                </div>
                {/* Confronti nel totale */}
                <div style={{display:"flex",gap:12,marginTop:12,paddingTop:12,borderTop:`1px solid ${C.border}`}}>
                  <div style={{display:"flex",flexDirection:"column",gap:2}}>
                    <span style={{fontSize:10,color:C.muted,letterSpacing:0.5,textTransform:"uppercase"}}>Mese prec.</span>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:12,color:C.muted}}>{fmt(totalPrevEarned)}</span>
                      {totalPrevEarned>0 && <DeltaIncome current={totalEarned} reference={totalPrevEarned}/>}
                    </div>
                  </div>
                  <div style={{width:1,background:C.border}}/>
                  <div style={{display:"flex",flexDirection:"column",gap:2}}>
                    <span style={{fontSize:10,color:C.muted,letterSpacing:0.5,textTransform:"uppercase"}}>Media storica</span>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:12,color:C.muted}}>{totalAvgEarned!=null?fmt(totalAvgEarned):"n/d"}</span>
                      {totalAvgEarned!=null&&totalAvgEarned>0 && <DeltaIncome current={totalEarned} reference={totalAvgEarned}/>}
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Dettaglio per categoria — espandibile */}
            {incomeExpanded && (
              <div style={{background:C.surface,borderRadius:"0 0 16px 16px",
                border:`1px solid ${C.border}`,borderTop:"none",marginBottom:12}}>
                {catRows.map(({cat,earned,prevEarned,avgEarned},i)=>(
                  <div key={cat.id} style={{padding:"12px 16px",
                    borderBottom: i<catRows.length-1?`1px solid ${C.border}`:"none"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                      <div style={{width:32,height:32,borderRadius:9,background:`${cat.color}22`,
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                        {cat.icon}
                      </div>
                      <div style={{flex:1}}>
                        <p style={{margin:0,fontSize:13,fontWeight:600,color:C.text}}>{cat.name}</p>
                        <p style={{margin:0,fontSize:13,fontWeight:700,color:earned>0?C.green:C.muted}}>
                          {earned>0?"+":""}{fmt(earned)}
                        </p>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:12,paddingLeft:42}}>
                      <div>
                        <span style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:0.5}}>Mese prec. </span>
                        <span style={{fontSize:12,color:C.muted}}>{fmt(prevEarned)}</span>
                        {prevEarned>0 && <> <DeltaIncome current={earned} reference={prevEarned}/></>}
                      </div>
                      <div style={{width:1,background:C.border}}/>
                      <div>
                        <span style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:0.5}}>Media </span>
                        <span style={{fontSize:12,color:C.muted}}>{avgEarned!=null?fmt(avgEarned):"n/d"}</span>
                        {avgEarned!=null&&avgEarned>0 && <> <DeltaIncome current={earned} reference={avgEarned}/></>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RECURRING PAGE
// ─────────────────────────────────────────────────────────────────────────────
function RecurringPage({ recurring, setRecurring, categories, members, activeMember }) {
  const allCats = [...categories.out, ...categories.in];
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const empty = { name:"", amount:"", categoryId:categories.out[0]?.id||"", memberId:activeMember.id, active:true };
  const [form, setForm] = useState(empty);

  const openAdd  = () => { setForm(empty); setEditing(null); setShowForm(true); };
  const openEdit = r  => { setForm({...r,amount:String(r.amount)}); setEditing(r.id); setShowForm(true); };
  const saveForm = () => {
    const n = parseFloat(String(form.amount).replace(",","."));
    if (!form.name.trim()||isNaN(n)||n<=0) return;
    const entry = {...form, amount:n, id:editing||Date.now().toString()};
    if (editing) setRecurring(rs=>rs.map(r=>r.id===editing?entry:r));
    else setRecurring(rs=>[...rs,entry]);
    setShowForm(false);
  };

  const totalMonthly = recurring.filter(r=>r.active).reduce((s,r)=>s+r.amount,0);

  return (
    <div>
      <h2 style={{margin:"0 0 4px",fontSize:18,fontWeight:700}}>Spese fisse</h2>
      <p style={{margin:"0 0 16px",fontSize:13,color:C.muted}}>Incluse automaticamente ogni mese nei calcoli</p>

      <div style={{background:`linear-gradient(135deg,#f8717122,${C.card})`,border:`1px solid #f8717144`,
        borderRadius:16,padding:16,marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <p style={{margin:0,fontSize:11,color:C.muted,letterSpacing:1,textTransform:"uppercase"}}>Totale mensile fisso</p>
          <p style={{margin:"4px 0 0",fontSize:24,fontWeight:800,color:C.red}}>{fmt(totalMonthly)}</p>
        </div>
        <span style={{fontSize:36}}>🔄</span>
      </div>

      {showForm && (
        <div style={{background:C.card,borderRadius:16,padding:16,marginBottom:16,border:`1px solid ${C.accent}44`}}>
          <p style={{margin:"0 0 12px",fontWeight:700,fontSize:14}}>{editing?"✏️ Modifica":"➕ Nuova"} spesa fissa</p>
          <label style={{fontSize:11,color:C.muted,letterSpacing:1}}>NOME</label>
          <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="es. Affitto, Netflix..."
            style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:14,marginTop:4,marginBottom:12,boxSizing:"border-box"}}/>
          <label style={{fontSize:11,color:C.muted,letterSpacing:1}}>IMPORTO (€)</label>
          <input value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} placeholder="0,00" type="number" min="0" step="0.01"
            style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:20,fontWeight:700,marginTop:4,marginBottom:12,boxSizing:"border-box"}}/>
          <label style={{fontSize:11,color:C.muted,letterSpacing:1}}>CATEGORIA</label>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:6,marginBottom:12}}>
            {categories.out.map(c=>(
              <button key={c.id} onClick={()=>setForm(f=>({...f,categoryId:c.id}))}
                style={{padding:"6px 10px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,
                  background:form.categoryId===c.id?`${c.color}33`:C.bg,
                  color:form.categoryId===c.id?c.color:C.muted,
                  outline:form.categoryId===c.id?`1.5px solid ${c.color}`:"none"}}>
                {c.icon} {c.name}
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setShowForm(false)} style={{flex:1,padding:10,borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer"}}>Annulla</button>
            <button onClick={saveForm} style={{flex:2,padding:10,borderRadius:10,border:"none",background:C.accent,color:"#fff",cursor:"pointer",fontWeight:700}}>
              {editing?"Salva modifiche":"Aggiungi"}
            </button>
          </div>
        </div>
      )}

      {recurring.length===0&&!showForm&&(
        <div style={{textAlign:"center",padding:"32px 0",color:C.muted}}>
          <div style={{fontSize:40,marginBottom:8}}>🔄</div>
          <p style={{margin:0}}>Nessuna spesa fissa configurata</p>
        </div>
      )}

      {recurring.map(r=>{
        const cat=allCats.find(c=>c.id===r.categoryId)||{name:"Altro",icon:"📦",color:C.muted};
        return (
          <div key={r.id} style={{background:C.card,borderRadius:14,padding:14,marginBottom:10,
            display:"flex",alignItems:"center",gap:12,opacity:r.active?1:0.5}}>
            <div style={{width:42,height:42,borderRadius:12,background:`${cat.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
              {cat.icon}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <p style={{margin:0,fontSize:14,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.name}</p>
              <p style={{margin:0,fontSize:11,color:C.muted}}>{cat.name}{!r.active?" · In pausa":""}</p>
            </div>
            <span style={{fontWeight:800,fontSize:15,color:C.red,flexShrink:0}}>-{fmt(r.amount)}</span>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <button onClick={()=>openEdit(r)} style={{padding:"4px 8px",borderRadius:6,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer",fontSize:11}}>✏️</button>
              <button onClick={()=>setRecurring(rs=>rs.map(x=>x.id===r.id?{...x,active:!x.active}:x))}
                style={{padding:"4px 8px",borderRadius:6,border:`1px solid ${C.border}`,background:"transparent",color:r.active?C.amber:C.green,cursor:"pointer",fontSize:11}}>
                {r.active?"⏸":"▶"}
              </button>
              <button onClick={()=>setRecurring(rs=>rs.filter(x=>x.id!==r.id))}
                style={{padding:"4px 8px",borderRadius:6,border:`1px solid ${C.border}`,background:"transparent",color:C.red,cursor:"pointer",fontSize:11}}>🗑</button>
            </div>
          </div>
        );
      })}

      {!showForm&&(
        <button onClick={openAdd} style={{width:"100%",padding:14,borderRadius:14,border:`1px dashed ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer",fontSize:14,marginTop:4}}>
          + Aggiungi spesa fissa
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAMILY PAGE
// ─────────────────────────────────────────────────────────────────────────────
function FamilyPage({ members, setMembers, transactions, filterMonth, filterYear, currentMember, setCurrentMember, recurring, userTxs, deletedIds, budgets, setUserTxs, setDeletedIds, setRecurring, setBudgets, setMembers2, setCurrentMember2, allCats }) {
  const [adding, setAdding] = useState(false);
  const [importText, setImportText] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [exporting, setExporting] = useState(false);

  // ── Backup JSON ──────────────────────────────────────────────────────────
  const exportData = () => {
    const payload = { userTxs, deletedIds, members, currentMember, recurring, budgets };
    const blob = new Blob([JSON.stringify(payload)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="familyfinance_backup.json";
    a.click(); URL.revokeObjectURL(url);
  };

  // ── Export Excel storico completo ────────────────────────────────────────
  const exportExcel = async () => {
    setExporting(true);
    try {
      // Carica SheetJS dinamicamente (funziona sia nell'artefatto che su Vercel)
      const XLSX = await import("https://cdn.sheetjs.com/xlsx-0.20.2/package/xlsx.mjs");
      const wb = XLSX.utils.book_new();

      // ── Foglio 1: Tutte le transazioni ──────────────────────────────────
      const txRows = [...transactions]
        .sort((a,b) => new Date(a.date) - new Date(b.date))
        .map(t => {
          const cat = allCats.find(c => c.id === t.categoryId) || { name: "Altro" };
          const member = members.find(m => m.id === t.memberId) || { name: "Famiglia" };
          const d = new Date(t.date);
          return {
            "Data":        t.date,
            "Mese":        d.toLocaleString("it-IT", { month: "long", year: "numeric" }),
            "Tipo":        t.type === "in" ? "Entrata" : "Uscita",
            "Importo €":   t.type === "in" ? t.amount : -t.amount,
            "Categoria":   cat.name,
            "Descrizione": t.note || "",
            "Membro":      member.name,
          };
        });

      const wsTx = XLSX.utils.json_to_sheet(txRows);

      // Larghezze colonne
      wsTx["!cols"] = [
        {wch:12}, {wch:18}, {wch:10}, {wch:12}, {wch:20}, {wch:30}, {wch:15}
      ];
      XLSX.utils.book_append_sheet(wb, wsTx, "Transazioni");

      // ── Foglio 2: Riepilogo mensile ──────────────────────────────────────
      const byMonth = {};
      transactions.forEach(t => {
        const key = t.date.slice(0,7);
        if (!byMonth[key]) byMonth[key] = { entrate:0, uscite:0 };
        if (t.type==="in") byMonth[key].entrate += t.amount;
        else               byMonth[key].uscite  += t.amount;
      });

      const summaryRows = Object.entries(byMonth)
        .sort(([a],[b]) => a.localeCompare(b))
        .map(([month, vals]) => {
          const [y,m] = month.split("-");
          const label = new Date(+y, +m-1, 1).toLocaleString("it-IT", { month:"long", year:"numeric" });
          const saldo = vals.entrate - vals.uscite;
          return {
            "Mese":        label,
            "Entrate €":   +vals.entrate.toFixed(2),
            "Uscite €":    +vals.uscite.toFixed(2),
            "Saldo €":     +saldo.toFixed(2),
          };
        });

      const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
      wsSummary["!cols"] = [{wch:20},{wch:14},{wch:14},{wch:14}];
      XLSX.utils.book_append_sheet(wb, wsSummary, "Riepilogo mensile");

      // ── Foglio 3: Riepilogo per categoria ───────────────────────────────
      const byCat = {};
      transactions.forEach(t => {
        const cat = allCats.find(c => c.id === t.categoryId) || { name:"Altro" };
        const key = cat.name;
        if (!byCat[key]) byCat[key] = { tipo: t.type==="in"?"Entrata":"Uscita", totale:0, count:0 };
        byCat[key].totale += t.amount;
        byCat[key].count++;
      });

      const catRows = Object.entries(byCat)
        .sort((a,b) => b[1].totale - a[1].totale)
        .map(([name, vals]) => ({
          "Categoria":    name,
          "Tipo":         vals.tipo,
          "Totale €":     +vals.totale.toFixed(2),
          "N° movimenti": vals.count,
          "Media €":      +(vals.totale / vals.count).toFixed(2),
        }));

      const wsCat = XLSX.utils.json_to_sheet(catRows);
      wsCat["!cols"] = [{wch:22},{wch:10},{wch:14},{wch:14},{wch:12}];
      XLSX.utils.book_append_sheet(wb, wsCat, "Per categoria");

      // ── Download via blob (funziona in artefatto e browser) ──────────────
      const today = new Date().toISOString().slice(0,10);
      const wbout = XLSX.write(wb, { bookType:"xlsx", type:"array" });
      const blob = new Blob([wbout], { type:"application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `FamilyFinance_${today}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch(e) {
      console.error("Export Excel fallito:", e);
      alert("Errore durante l'export: " + e.message);
    }
    setExporting(false);
  };

  const importData = () => {
    try {
      const d = JSON.parse(importText);
      if (d.userTxs)    setUserTxs(d.userTxs);
      if (d.deletedIds) setDeletedIds(d.deletedIds);
      if (d.members)    setMembers2(d.members);
      if (d.currentMember) setCurrentMember2(d.currentMember);
      if (d.recurring)  setRecurring(d.recurring);
      if (d.budgets)    setBudgets(d.budgets);
      setShowImport(false); setImportText("");
      alert("Dati importati con successo!");
    } catch(e) { alert("Errore nel file JSON: " + e.message); }
  };

  return (
    <div>
      <h2 style={{margin:"0 0 4px",fontSize:18,fontWeight:700}}>Famiglia</h2>
      <p style={{margin:"0 0 16px",fontSize:13,color:C.muted}}>Gestisci i membri della famiglia</p>

      {/* Export/Import backup */}
      <div style={{background:C.card,borderRadius:16,padding:16,marginBottom:16}}>
        <p style={{margin:"0 0 10px",fontSize:13,fontWeight:700}}>📊 Report & Backup</p>

        {/* Excel export — prominente */}
        <button onClick={exportExcel} disabled={exporting}
          style={{width:"100%",padding:"14px",borderRadius:12,border:"none",
            background:`linear-gradient(135deg,#217346,#1a5c38)`,
            color:"#fff",cursor:exporting?"wait":"pointer",fontWeight:700,fontSize:14,
            marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8,
            opacity:exporting?0.7:1}}>
          <span style={{fontSize:20}}>📥</span>
          {exporting ? "Generazione in corso..." : "Scarica storico Excel (.xlsx)"}
        </button>
        <p style={{margin:"0 0 12px",fontSize:11,color:C.muted,textAlign:"center"}}>
          3 fogli: tutte le transazioni · riepilogo mensile · per categoria
        </p>

        {/* Separatore */}
        <div style={{borderTop:`1px solid ${C.border}`,paddingTop:10,marginTop:4}}>
          <p style={{margin:"0 0 8px",fontSize:11,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5}}>Backup dati app</p>
          <div style={{display:"flex",gap:8}}>
            <button onClick={exportData}
              style={{flex:1,padding:"9px",borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer",fontSize:12}}>
              ⬇ Esporta JSON
            </button>
            <button onClick={()=>setShowImport(s=>!s)}
              style={{flex:1,padding:"9px",borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer",fontSize:12}}>
              ⬆ Importa JSON
            </button>
          </div>
        </div>
        {showImport && (
          <div style={{marginTop:12}}>
            <textarea
              value={importText} onChange={e=>setImportText(e.target.value)}
              placeholder='Incolla qui il contenuto del file JSON...'
              style={{width:"100%",height:80,padding:10,borderRadius:10,border:`1px solid ${C.border}`,
                background:C.bg,color:C.text,fontSize:12,resize:"none",boxSizing:"border-box"}}/>
            <button onClick={importData}
              style={{width:"100%",marginTop:8,padding:10,borderRadius:10,border:"none",
                background:C.green,color:"#fff",cursor:"pointer",fontWeight:700,fontSize:13}}>
              Importa
            </button>
          </div>
        )}
      </div>
      {members.map(m=>{
        const txs=transactions.filter(t=>{const d=new Date(t.date);return t.memberId===m.id&&d.getMonth()===filterMonth&&d.getFullYear()===filterYear;});
        const recAmt=recurring.filter(r=>r.active&&r.memberId===m.id).reduce((s,r)=>s+r.amount,0);
        const inc=txs.filter(t=>t.type==="in").reduce((s,t)=>s+t.amount,0);
        const exp=txs.filter(t=>t.type==="out").reduce((s,t)=>s+t.amount,0)+recAmt;
        return (
          <div key={m.id} style={{background:C.card,borderRadius:16,padding:16,marginBottom:12,
            border:currentMember===m.id?`1px solid ${C.accent}66`:`1px solid transparent`}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:36}}>{m.avatar}</span>
              <div style={{flex:1}}>
                <p style={{margin:0,fontSize:15,fontWeight:700}}>{m.name}</p>
                <p style={{margin:0,fontSize:12,color:C.muted}}>{txs.length} movimenti questo mese</p>
              </div>
              <div style={{textAlign:"right"}}>
                <p style={{margin:0,fontSize:13,color:C.green}}>+{fmt(inc)}</p>
                <p style={{margin:0,fontSize:13,color:C.red}}>-{fmt(exp)}</p>
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <button onClick={()=>setCurrentMember(m.id)}
                style={{flex:1,padding:8,borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,
                  background:currentMember===m.id?C.accent:C.surface, color:currentMember===m.id?"#fff":C.muted}}>
                {currentMember===m.id?"✓ Attivo":"Imposta attivo"}
              </button>
              {members.length>1&&(
                <button onClick={()=>setMembers(ms=>ms.filter(x=>x.id!==m.id))}
                  style={{padding:"8px 12px",borderRadius:8,border:"none",background:C.surface,color:C.red,cursor:"pointer",fontSize:12}}>
                  Rimuovi
                </button>
              )}
            </div>
          </div>
        );
      })}
      {!adding ? (
        <button onClick={()=>setAdding(true)}
          style={{width:"100%",padding:16,borderRadius:16,border:`1px dashed ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer",fontSize:14}}>
          + Aggiungi membro
        </button>
      ) : (
        <MemberForm onSave={m=>{setMembers(ms=>[...ms,m]);setAdding(false);}} onClose={()=>setAdding(false)} inline/>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TRANSACTION MODAL
// ─────────────────────────────────────────────────────────────────────────────
function TxModal({ tx, defaultType="out", categories, members, activeMember, onSave, onClose }) {
  const [type,     setType]     = useState(tx?.type||defaultType);
  const [amount,   setAmount]   = useState(tx?String(tx.amount):"");
  const [catId,    setCatId]    = useState(tx?.categoryId||(defaultType==="in"?categories.in[0]?.id:categories.out[0]?.id)||"");
  const [note,     setNote]     = useState(tx?.note||"");
  const [date,     setDate]     = useState(tx?.date||new Date().toISOString().slice(0,10));
  const [memberId, setMemberId] = useState(tx?.memberId||activeMember.id);
  const cats = type==="out"?categories.out:categories.in;
  const submit = () => {
    const n = parseFloat(amount.replace(",","."));
    if (isNaN(n)||n<=0||!catId) return;
    onSave({ id:tx?.id||Date.now().toString(), type, amount:n, categoryId:catId, note, date, memberId });
  };
  return (
    <div style={{position:"fixed",inset:0,background:"#000a",zIndex:200,display:"flex",flexDirection:"column",justifyContent:"flex-end"}} onClick={onClose}>
      <div style={{width:"100%",maxWidth:480,margin:"0 auto",background:C.surface,borderRadius:"20px 20px 0 0",
        display:"flex",flexDirection:"column",maxHeight:"92vh"}} onClick={e=>e.stopPropagation()}>

        {/* Header fisso — sempre visibile */}
        <div style={{flexShrink:0,padding:"14px 20px 12px",borderBottom:`1px solid ${C.border}`,
          display:"flex",alignItems:"center",justifyContent:"space-between",background:C.surface,borderRadius:"20px 20px 0 0"}}>
          <button onClick={onClose}
            style={{width:36,height:36,borderRadius:"50%",background:C.card,border:`1px solid ${C.border}`,
              color:C.text,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",
              justifyContent:"center",fontWeight:300,flexShrink:0}}>
            ×
          </button>
          <h3 style={{margin:0,fontSize:17,fontWeight:700}}>{tx?"Modifica":"Nuovo movimento"}</h3>
          <div style={{width:36}}/>
        </div>

        {/* Corpo scrollabile */}
        <div style={{overflowY:"auto",padding:"20px 20px 40px"}}>
        <div style={{display:"flex",background:C.card,borderRadius:12,padding:4,marginBottom:20}}>
          {[["out","Uscita","💸"],["in","Entrata","💰"]].map(([v,label,ico])=>(
            <button key={v} onClick={()=>{setType(v);setCatId(v==="out"?categories.out[0]?.id:categories.in[0]?.id);}}
              style={{flex:1,padding:"10px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700,fontSize:14,
                background:type===v?(v==="out"?C.red:C.green):"transparent", color:type===v?"#fff":C.muted}}>
              {ico} {label}
            </button>
          ))}
        </div>
        <label style={{fontSize:12,color:C.muted,letterSpacing:1}}>IMPORTO</label>
        <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0,00" type="number" min="0" step="0.01"
          style={{width:"100%",padding:"14px 16px",borderRadius:12,border:`1px solid ${C.border}`,background:C.card,color:C.text,fontSize:24,fontWeight:800,marginTop:6,marginBottom:16,boxSizing:"border-box"}}/>
        <label style={{fontSize:12,color:C.muted,letterSpacing:1}}>CATEGORIA</label>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:8,marginBottom:16}}>
          {cats.map(c=>(
            <button key={c.id} onClick={()=>setCatId(c.id)}
              style={{padding:"8px 12px",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:500,
                background:catId===c.id?`${c.color}33`:C.card, color:catId===c.id?c.color:C.muted,
                outline:catId===c.id?`1.5px solid ${c.color}`:"none"}}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
        <label style={{fontSize:12,color:C.muted,letterSpacing:1}}>NOTA (opzionale)</label>
        <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Descrizione..."
          style={{width:"100%",padding:"12px 14px",borderRadius:12,border:`1px solid ${C.border}`,background:C.card,color:C.text,fontSize:14,marginTop:6,marginBottom:16,boxSizing:"border-box"}}/>
        <label style={{fontSize:12,color:C.muted,letterSpacing:1}}>DATA</label>
        <input value={date} onChange={e=>setDate(e.target.value)} type="date"
          style={{width:"100%",padding:"12px 14px",borderRadius:12,border:`1px solid ${C.border}`,background:C.card,color:C.text,fontSize:14,marginTop:6,marginBottom:16,boxSizing:"border-box"}}/>
        {members.length>1&&(
          <>
            <label style={{fontSize:12,color:C.muted,letterSpacing:1}}>MEMBRO</label>
            <div style={{display:"flex",gap:8,marginTop:8,marginBottom:16}}>
              {members.map(m=>(
                <button key={m.id} onClick={()=>setMemberId(m.id)}
                  style={{padding:"8px 12px",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,
                    background:memberId===m.id?C.accent:C.card, color:memberId===m.id?"#fff":C.muted}}>
                  {m.avatar} {m.name}
                </button>
              ))}
            </div>
          </>
        )}
        <button onClick={submit}
          style={{width:"100%",padding:16,borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.accent},#9d6af7)`,color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer"}}>
          {tx?"Salva modifiche":"Aggiungi"}
        </button>
        </div>{/* fine scroll */}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MEMBER FORM
// ─────────────────────────────────────────────────────────────────────────────
function MemberForm({ onSave, onClose, inline }) {
  const [name,   setName]   = useState("");
  const [avatar, setAvatar] = useState("👤");
  const AVATARS = ["👨","👩","👧","👦","👴","👵","🧑","👶","🐱","🐶","🦁","🐼"];
  const submit = () => { if (!name.trim()) return; onSave({id:Date.now().toString(),name:name.trim(),avatar,color:C.accent}); };
  const content = (
    <div>
      <h3 style={{margin:"0 0 16px",fontSize:16,fontWeight:700}}>Nuovo membro</h3>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        {AVATARS.map(a=>(
          <button key={a} onClick={()=>setAvatar(a)}
            style={{width:44,height:44,borderRadius:10,border:avatar===a?`2px solid ${C.accent}`:"none",background:C.card,cursor:"pointer",fontSize:24}}>
            {a}
          </button>
        ))}
      </div>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome..." onKeyDown={e=>e.key==="Enter"&&submit()}
        style={{width:"100%",padding:"12px 14px",borderRadius:12,border:`1px solid ${C.border}`,background:C.card,color:C.text,fontSize:14,marginBottom:12,boxSizing:"border-box"}}/>
      <div style={{display:"flex",gap:8}}>
        <button onClick={onClose} style={{flex:1,padding:12,borderRadius:12,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer"}}>Annulla</button>
        <button onClick={submit} style={{flex:2,padding:12,borderRadius:12,border:"none",background:C.accent,color:"#fff",cursor:"pointer",fontWeight:700}}>Aggiungi</button>
      </div>
    </div>
  );
  if (inline) return <div style={{background:C.card,borderRadius:16,padding:16}}>{content}</div>;
  return (
    <div style={{position:"fixed",inset:0,background:"#000a",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div style={{width:"100%",maxWidth:400,background:C.surface,borderRadius:20,padding:24}} onClick={e=>e.stopPropagation()}>
        {content}
      </div>
    </div>
  );
}
