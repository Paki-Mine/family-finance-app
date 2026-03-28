import React, { useState, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DATI (invariati dall'originale)
// ─────────────────────────────────────────────────────────────────────────────
const INIT_MEMBERS = [{ id:"1", name:"Famiglia", avatar:"👨‍👩‍👧‍👦", color:"#7c6af7" }];

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
    { id:"co11", name:"Ristoranti", icon:"🍽️", color:"#f97316" },
  ],
  in: [
    { id:"ci0", name:"Stipendio",    icon:"💼", color:"#a78bfa" },
    { id:"ci1", name:"Freelance",    icon:"💻", color:"#34d399" },
    { id:"ci2", name:"Investimenti", icon:"📈", color:"#f59e0b" },
    { id:"ci3", name:"Bonus",        icon:"🎁", color:"#60a5fa" },
    { id:"ci4", name:"Altro",        icon:"📥", color:"#e879f9" },
  ],
};

// Spese fisse: gestite SOLO qui, visualizzate come virtuali, mai duplicate
const INIT_RECURRING = [
  { id:"r1", name:"Mutuo/Affitto",     amount:500, categoryId:"co0", memberId:"1", active:true },
  { id:"r2", name:"Telefonia",          amount:20,  categoryId:"co0", memberId:"1", active:true },
  { id:"r3", name:"Internet",           amount:30,  categoryId:"co0", memberId:"1", active:true },
  { id:"r4", name:"Netflix/Spotify",    amount:20,  categoryId:"co4", memberId:"1", active:true },
  { id:"r5", name:"Caffè",              amount:26,  categoryId:"co1", memberId:"1", active:true },
  { id:"r6", name:"Assicurazione vita", amount:35,  categoryId:"co3", memberId:"1", active:true },
];

// Transazioni REALI marzo 2026 — senza le ricorrenti (già sopra)
// Entrate: €3.225 | Uscite reali: €1.080 | Ricorrenti: €631 | Totale uscite: €1.711 | Saldo: +€1.514
const HISTORICAL_TRANSACTIONS = [{"id": "h1000", "type": "in", "amount": 500.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2022-01-01", "memberId": "1"}, {"id": "h1001", "type": "in", "amount": 839.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2022-01-01", "memberId": "1"}, {"id": "h1002", "type": "in", "amount": 330.0, "categoryId": "ci2", "note": "Affitti da case di proprietà", "date": "2022-01-01", "memberId": "1"}, {"id": "h1003", "type": "in", "amount": 300.0, "categoryId": "ci3", "note": "Dividendi da azioni", "date": "2022-01-01", "memberId": "1"}, {"id": "h1004", "type": "in", "amount": 350.0, "categoryId": "ci4", "note": "Risarcimenti ricevuti", "date": "2022-01-01", "memberId": "1"}, {"id": "h1005", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2022-01-01", "memberId": "1"}, {"id": "h1006", "type": "out", "amount": 180.0, "categoryId": "co0", "note": "Luce", "date": "2022-01-01", "memberId": "1"}, {"id": "h1007", "type": "out", "amount": 13.0, "categoryId": "co0", "note": "Telefonia", "date": "2022-01-01", "memberId": "1"}, {"id": "h1008", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2022-01-01", "memberId": "1"}, {"id": "h1009", "type": "out", "amount": 55.0, "categoryId": "co2", "note": "Benzina", "date": "2022-01-01", "memberId": "1"}, {"id": "h1010", "type": "out", "amount": 276.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2022-01-01", "memberId": "1"}, {"id": "h1011", "type": "out", "amount": 60.0, "categoryId": "co1", "note": "Caffè", "date": "2022-01-01", "memberId": "1"}, {"id": "h1012", "type": "out", "amount": 131.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2022-01-01", "memberId": "1"}, {"id": "h1013", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify", "date": "2022-01-01", "memberId": "1"}, {"id": "h1014", "type": "out", "amount": 25.0, "categoryId": "co4", "note": "Sigarette", "date": "2022-01-01", "memberId": "1"}, {"id": "h1015", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2022-01-01", "memberId": "1"}, {"id": "h1016", "type": "out", "amount": 46.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2022-01-01", "memberId": "1"}, {"id": "h1017", "type": "out", "amount": 150.0, "categoryId": "co3", "note": "Dentista/Oculista/Dermatologa", "date": "2022-01-01", "memberId": "1"}, {"id": "h1018", "type": "out", "amount": 84.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2022-01-01", "memberId": "1"}, {"id": "h1019", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2022-01-01", "memberId": "1"}, {"id": "h1020", "type": "out", "amount": 188.0, "categoryId": "co3", "note": "Estetista/Fisioterapia/Massaggi", "date": "2022-01-01", "memberId": "1"}, {"id": "h1021", "type": "out", "amount": 75.0, "categoryId": "co10", "note": "Hotel e pernottamento", "date": "2022-01-01", "memberId": "1"}, {"id": "h1022", "type": "out", "amount": 40.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2022-01-01", "memberId": "1"}, {"id": "h1023", "type": "in", "amount": 400.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2022-02-01", "memberId": "1"}, {"id": "h1024", "type": "in", "amount": 780.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2022-02-01", "memberId": "1"}, {"id": "h1025", "type": "in", "amount": 400.0, "categoryId": "ci2", "note": "Affitti da case di proprietà", "date": "2022-02-01", "memberId": "1"}, {"id": "h1026", "type": "in", "amount": 400.0, "categoryId": "ci3", "note": "Dividendi da azioni", "date": "2022-02-01", "memberId": "1"}, {"id": "h1027", "type": "in", "amount": 300.0, "categoryId": "ci4", "note": "Risarcimenti ricevuti", "date": "2022-02-01", "memberId": "1"}, {"id": "h1028", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2022-02-01", "memberId": "1"}, {"id": "h1029", "type": "out", "amount": 35.0, "categoryId": "co0", "note": "Acqua", "date": "2022-02-01", "memberId": "1"}, {"id": "h1030", "type": "out", "amount": 13.0, "categoryId": "co0", "note": "Telefonia", "date": "2022-02-01", "memberId": "1"}, {"id": "h1031", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2022-02-01", "memberId": "1"}, {"id": "h1032", "type": "out", "amount": 465.0, "categoryId": "co2", "note": "Assicurazione auto", "date": "2022-02-01", "memberId": "1"}, {"id": "h1033", "type": "out", "amount": 90.0, "categoryId": "co2", "note": "Benzina", "date": "2022-02-01", "memberId": "1"}, {"id": "h1034", "type": "out", "amount": 365.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2022-02-01", "memberId": "1"}, {"id": "h1035", "type": "out", "amount": 20.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2022-02-01", "memberId": "1"}, {"id": "h1036", "type": "out", "amount": 105.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2022-02-01", "memberId": "1"}, {"id": "h1037", "type": "out", "amount": 210.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2022-02-01", "memberId": "1"}, {"id": "h1038", "type": "out", "amount": 18.0, "categoryId": "co4", "note": "Netflix/Spotify", "date": "2022-02-01", "memberId": "1"}, {"id": "h1039", "type": "out", "amount": 20.0, "categoryId": "co4", "note": "Sigarette", "date": "2022-02-01", "memberId": "1"}, {"id": "h1040", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2022-02-01", "memberId": "1"}, {"id": "h1041", "type": "out", "amount": 208.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2022-02-01", "memberId": "1"}, {"id": "h1042", "type": "out", "amount": 80.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2022-02-01", "memberId": "1"}, {"id": "h1043", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Estetista/Fisioterapia/Massaggi", "date": "2022-02-01", "memberId": "1"}, {"id": "h1044", "type": "out", "amount": 268.0, "categoryId": "co10", "note": "Hotel e pernottamento", "date": "2022-02-01", "memberId": "1"}, {"id": "h1045", "type": "out", "amount": 19.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2022-02-01", "memberId": "1"}, {"id": "h1046", "type": "out", "amount": 1600.0, "categoryId": "co6", "note": "Istruzione e formazione personale", "date": "2022-02-01", "memberId": "1"}, {"id": "h1047", "type": "out", "amount": 48.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2022-02-01", "memberId": "1"}, {"id": "h1048", "type": "in", "amount": 1372.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2022-03-01", "memberId": "1"}, {"id": "h1049", "type": "in", "amount": 300.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2022-03-01", "memberId": "1"}, {"id": "h1050", "type": "in", "amount": 600.0, "categoryId": "ci2", "note": "Affitti da case di proprietà", "date": "2022-03-01", "memberId": "1"}, {"id": "h1051", "type": "in", "amount": 500.0, "categoryId": "ci3", "note": "Dividendi da azioni", "date": "2022-03-01", "memberId": "1"}, {"id": "h1052", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2022-03-01", "memberId": "1"}, {"id": "h1053", "type": "out", "amount": 47.7, "categoryId": "co0", "note": "Acqua", "date": "2022-03-01", "memberId": "1"}, {"id": "h1054", "type": "out", "amount": 210.0, "categoryId": "co0", "note": "Luce", "date": "2022-03-01", "memberId": "1"}, {"id": "h1055", "type": "out", "amount": 13.0, "categoryId": "co0", "note": "Telefonia", "date": "2022-03-01", "memberId": "1"}, {"id": "h1056", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2022-03-01", "memberId": "1"}, {"id": "h1057", "type": "out", "amount": 198.0, "categoryId": "co0", "note": "TradingView abbonamento annuale", "date": "2022-03-01", "memberId": "1"}, {"id": "h1058", "type": "out", "amount": 130.0, "categoryId": "co2", "note": "Benzina", "date": "2022-03-01", "memberId": "1"}, {"id": "h1059", "type": "out", "amount": 290.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2022-03-01", "memberId": "1"}, {"id": "h1060", "type": "out", "amount": 510.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2022-03-01", "memberId": "1"}, {"id": "h1061", "type": "out", "amount": 14.5, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2022-03-01", "memberId": "1"}, {"id": "h1062", "type": "out", "amount": 10.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2022-03-01", "memberId": "1"}, {"id": "h1063", "type": "out", "amount": 60.0, "categoryId": "co1", "note": "Caffè", "date": "2022-03-01", "memberId": "1"}, {"id": "h1064", "type": "out", "amount": 404.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2022-03-01", "memberId": "1"}, {"id": "h1065", "type": "out", "amount": 18.0, "categoryId": "co4", "note": "Netflix/Spotify", "date": "2022-03-01", "memberId": "1"}, {"id": "h1066", "type": "out", "amount": 10.0, "categoryId": "co4", "note": "Sigarette", "date": "2022-03-01", "memberId": "1"}, {"id": "h1067", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2022-03-01", "memberId": "1"}, {"id": "h1068", "type": "out", "amount": 160.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2022-03-01", "memberId": "1"}, {"id": "h1069", "type": "out", "amount": 20.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2022-03-01", "memberId": "1"}, {"id": "h1070", "type": "out", "amount": 9.0, "categoryId": "co3", "note": "Estetista/Fisioterapia/Massaggi", "date": "2022-03-01", "memberId": "1"}, {"id": "h1071", "type": "out", "amount": 35.0, "categoryId": "co10", "note": "Viaggio", "date": "2022-03-01", "memberId": "1"}, {"id": "h1072", "type": "out", "amount": 160.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2022-03-01", "memberId": "1"}, {"id": "h1073", "type": "out", "amount": 80.0, "categoryId": "co6", "note": "Istruzione e formazione personale", "date": "2022-03-01", "memberId": "1"}, {"id": "h1074", "type": "in", "amount": 500.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2022-04-01", "memberId": "1"}, {"id": "h1075", "type": "in", "amount": 1200.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2022-04-01", "memberId": "1"}, {"id": "h1076", "type": "in", "amount": 500.0, "categoryId": "ci2", "note": "Affitti da case di proprietà", "date": "2022-04-01", "memberId": "1"}, {"id": "h1077", "type": "in", "amount": 600.0, "categoryId": "ci3", "note": "Dividendi da azioni", "date": "2022-04-01", "memberId": "1"}, {"id": "h1078", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2022-04-01", "memberId": "1"}, {"id": "h1079", "type": "out", "amount": 13.0, "categoryId": "co0", "note": "Telefonia", "date": "2022-04-01", "memberId": "1"}, {"id": "h1080", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2022-04-01", "memberId": "1"}, {"id": "h1081", "type": "out", "amount": 65.0, "categoryId": "co2", "note": "Benzina", "date": "2022-04-01", "memberId": "1"}, {"id": "h1082", "type": "out", "amount": 70.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2022-04-01", "memberId": "1"}, {"id": "h1083", "type": "out", "amount": 456.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2022-04-01", "memberId": "1"}, {"id": "h1084", "type": "out", "amount": 80.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2022-04-01", "memberId": "1"}, {"id": "h1085", "type": "out", "amount": 140.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2022-04-01", "memberId": "1"}, {"id": "h1086", "type": "out", "amount": 490.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2022-04-01", "memberId": "1"}, {"id": "h1087", "type": "out", "amount": 17.99, "categoryId": "co4", "note": "Netflix/Spotify", "date": "2022-04-01", "memberId": "1"}, {"id": "h1088", "type": "out", "amount": 100.0, "categoryId": "co4", "note": "Sigarette", "date": "2022-04-01", "memberId": "1"}, {"id": "h1089", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2022-04-01", "memberId": "1"}, {"id": "h1090", "type": "out", "amount": 30.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2022-04-01", "memberId": "1"}, {"id": "h1091", "type": "out", "amount": 60.0, "categoryId": "co3", "note": "Estetista/Fisioterapia/Massaggi", "date": "2022-04-01", "memberId": "1"}, {"id": "h1092", "type": "out", "amount": 206.0, "categoryId": "co10", "note": "Viaggio", "date": "2022-04-01", "memberId": "1"}, {"id": "h1093", "type": "out", "amount": 240.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2022-04-01", "memberId": "1"}, {"id": "h1094", "type": "out", "amount": 64.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2022-04-01", "memberId": "1"}, {"id": "h1095", "type": "in", "amount": 320.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2022-05-01", "memberId": "1"}, {"id": "h1096", "type": "in", "amount": 600.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2022-05-01", "memberId": "1"}, {"id": "h1097", "type": "in", "amount": 1050.0, "categoryId": "ci2", "note": "Affitti da case di proprietà", "date": "2022-05-01", "memberId": "1"}, {"id": "h1098", "type": "in", "amount": 1196.0, "categoryId": "ci3", "note": "Dividendi da azioni", "date": "2022-05-01", "memberId": "1"}, {"id": "h1099", "type": "in", "amount": 500.0, "categoryId": "ci4", "note": "Risarcimenti ricevuti", "date": "2022-05-01", "memberId": "1"}, {"id": "h1100", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2022-05-01", "memberId": "1"}, {"id": "h1101", "type": "out", "amount": 177.0, "categoryId": "co0", "note": "Luce", "date": "2022-05-01", "memberId": "1"}, {"id": "h1102", "type": "out", "amount": 13.0, "categoryId": "co0", "note": "Telefonia", "date": "2022-05-01", "memberId": "1"}, {"id": "h1103", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2022-05-01", "memberId": "1"}, {"id": "h1104", "type": "out", "amount": 49.0, "categoryId": "co0", "note": "Imposte sugli immobili", "date": "2022-05-01", "memberId": "1"}, {"id": "h1105", "type": "out", "amount": 60.0, "categoryId": "co2", "note": "Benzina", "date": "2022-05-01", "memberId": "1"}, {"id": "h1106", "type": "out", "amount": 224.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2022-05-01", "memberId": "1"}, {"id": "h1107", "type": "out", "amount": 134.7, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2022-05-01", "memberId": "1"}, {"id": "h1108", "type": "out", "amount": 13.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2022-05-01", "memberId": "1"}, {"id": "h1109", "type": "out", "amount": 146.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2022-05-01", "memberId": "1"}, {"id": "h1110", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify", "date": "2022-05-01", "memberId": "1"}, {"id": "h1111", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2022-05-01", "memberId": "1"}, {"id": "h1112", "type": "out", "amount": 150.0, "categoryId": "co3", "note": "Dentista/Oculista", "date": "2022-05-01", "memberId": "1"}, {"id": "h1113", "type": "out", "amount": 95.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2022-05-01", "memberId": "1"}, {"id": "h1114", "type": "out", "amount": 100.0, "categoryId": "co3", "note": "Estetista/Fisioterapia/Massaggi", "date": "2022-05-01", "memberId": "1"}, {"id": "h1115", "type": "out", "amount": 25.0, "categoryId": "co10", "note": "Viaggio", "date": "2022-05-01", "memberId": "1"}, {"id": "h1116", "type": "out", "amount": 468.5, "categoryId": "co10", "note": "Spese in viaggio", "date": "2022-05-01", "memberId": "1"}, {"id": "h1117", "type": "out", "amount": 825.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2022-05-01", "memberId": "1"}, {"id": "h1118", "type": "out", "amount": 93.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2022-05-01", "memberId": "1"}, {"id": "h1119", "type": "in", "amount": 1000.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2022-06-01", "memberId": "1"}, {"id": "h1120", "type": "in", "amount": 1063.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2022-06-01", "memberId": "1"}, {"id": "h1121", "type": "in", "amount": 1000.0, "categoryId": "ci2", "note": "Affitti da case di proprietà", "date": "2022-06-01", "memberId": "1"}, {"id": "h1122", "type": "in", "amount": 1000.0, "categoryId": "ci3", "note": "Dividendi da azioni", "date": "2022-06-01", "memberId": "1"}, {"id": "h1123", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2022-06-01", "memberId": "1"}, {"id": "h1124", "type": "out", "amount": 40.8, "categoryId": "co0", "note": "Acqua", "date": "2022-06-01", "memberId": "1"}, {"id": "h1125", "type": "out", "amount": 13.0, "categoryId": "co0", "note": "Telefonia", "date": "2022-06-01", "memberId": "1"}, {"id": "h1126", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2022-06-01", "memberId": "1"}, {"id": "h1127", "type": "out", "amount": 290.0, "categoryId": "co2", "note": "Benzina", "date": "2022-06-01", "memberId": "1"}, {"id": "h1128", "type": "out", "amount": 30.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2022-06-01", "memberId": "1"}, {"id": "h1129", "type": "out", "amount": 429.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2022-06-01", "memberId": "1"}, {"id": "h1130", "type": "out", "amount": 81.28, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2022-06-01", "memberId": "1"}, {"id": "h1131", "type": "out", "amount": 47.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2022-06-01", "memberId": "1"}, {"id": "h1132", "type": "out", "amount": 15.0, "categoryId": "co1", "note": "Caffè", "date": "2022-06-01", "memberId": "1"}, {"id": "h1133", "type": "out", "amount": 235.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2022-06-01", "memberId": "1"}, {"id": "h1134", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify", "date": "2022-06-01", "memberId": "1"}, {"id": "h1135", "type": "out", "amount": 35.5, "categoryId": "co4", "note": "Sigarette", "date": "2022-06-01", "memberId": "1"}, {"id": "h1136", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2022-06-01", "memberId": "1"}, {"id": "h1137", "type": "out", "amount": 69.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2022-06-01", "memberId": "1"}, {"id": "h1138", "type": "out", "amount": 10.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2022-06-01", "memberId": "1"}, {"id": "h1139", "type": "out", "amount": 220.0, "categoryId": "co10", "note": "Hotel e pernottamento", "date": "2022-06-01", "memberId": "1"}, {"id": "h1140", "type": "out", "amount": 108.0, "categoryId": "co10", "note": "Spese in viaggio", "date": "2022-06-01", "memberId": "1"}, {"id": "h1141", "type": "out", "amount": 42.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2022-06-01", "memberId": "1"}, {"id": "h1142", "type": "out", "amount": 42.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2022-06-01", "memberId": "1"}, {"id": "h1143", "type": "in", "amount": 400.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2022-07-01", "memberId": "1"}, {"id": "h1144", "type": "in", "amount": 650.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2022-07-01", "memberId": "1"}, {"id": "h1145", "type": "in", "amount": 830.0, "categoryId": "ci2", "note": "Affitti da case di proprietà", "date": "2022-07-01", "memberId": "1"}, {"id": "h1146", "type": "in", "amount": 2350.0, "categoryId": "ci3", "note": "Dividendi da azioni", "date": "2022-07-01", "memberId": "1"}, {"id": "h1147", "type": "in", "amount": 1300.0, "categoryId": "ci4", "note": "Risarcimenti ricevuti", "date": "2022-07-01", "memberId": "1"}, {"id": "h1149", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2022-07-01", "memberId": "1"}, {"id": "h1150", "type": "out", "amount": 124.0, "categoryId": "co0", "note": "Luce", "date": "2022-07-01", "memberId": "1"}, {"id": "h1151", "type": "out", "amount": 13.0, "categoryId": "co0", "note": "Telefonia", "date": "2022-07-01", "memberId": "1"}, {"id": "h1152", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2022-07-01", "memberId": "1"}, {"id": "h1153", "type": "out", "amount": 175.0, "categoryId": "co2", "note": "Benzina", "date": "2022-07-01", "memberId": "1"}, {"id": "h1154", "type": "out", "amount": 78.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2022-07-01", "memberId": "1"}, {"id": "h1155", "type": "out", "amount": 286.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2022-07-01", "memberId": "1"}, {"id": "h1156", "type": "out", "amount": 66.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2022-07-01", "memberId": "1"}, {"id": "h1157", "type": "out", "amount": 421.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2022-07-01", "memberId": "1"}, {"id": "h1158", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify", "date": "2022-07-01", "memberId": "1"}, {"id": "h1159", "type": "out", "amount": 30.0, "categoryId": "co4", "note": "Sigarette", "date": "2022-07-01", "memberId": "1"}, {"id": "h1160", "type": "out", "amount": 135.0, "categoryId": "co8", "note": "Asilo figli (o babysitter)", "date": "2022-07-01", "memberId": "1"}, {"id": "h1161", "type": "out", "amount": 60.0, "categoryId": "co8", "note": "Altro figli (mance, regali)", "date": "2022-07-01", "memberId": "1"}, {"id": "h1162", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2022-07-01", "memberId": "1"}, {"id": "h1163", "type": "out", "amount": 40.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2022-07-01", "memberId": "1"}, {"id": "h1164", "type": "out", "amount": 650.0, "categoryId": "co3", "note": "Dentista/Oculista", "date": "2022-07-01", "memberId": "1"}, {"id": "h1165", "type": "out", "amount": 129.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2022-07-01", "memberId": "1"}, {"id": "h1166", "type": "out", "amount": 50.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2022-07-01", "memberId": "1"}, {"id": "h1167", "type": "out", "amount": 53.0, "categoryId": "co3", "note": "Estetista/Fisioterapia/Massaggi", "date": "2022-07-01", "memberId": "1"}, {"id": "h1168", "type": "out", "amount": 408.0, "categoryId": "co10", "note": "Viaggio", "date": "2022-07-01", "memberId": "1"}, {"id": "h1169", "type": "out", "amount": 515.0, "categoryId": "co10", "note": "Hotel e pernottamento", "date": "2022-07-01", "memberId": "1"}, {"id": "h1170", "type": "out", "amount": 44.0, "categoryId": "co10", "note": "Spese in viaggio", "date": "2022-07-01", "memberId": "1"}, {"id": "h1171", "type": "out", "amount": 1420.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2022-07-01", "memberId": "1"}, {"id": "h1172", "type": "out", "amount": 9.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2022-07-01", "memberId": "1"}, {"id": "h1173", "type": "in", "amount": 1000.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2022-08-01", "memberId": "1"}, {"id": "h1174", "type": "in", "amount": 1234.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2022-08-01", "memberId": "1"}, {"id": "h1175", "type": "in", "amount": 2000.0, "categoryId": "ci2", "note": "Affitti da case di proprietà", "date": "2022-08-01", "memberId": "1"}, {"id": "h1176", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2022-08-01", "memberId": "1"}, {"id": "h1177", "type": "out", "amount": 13.0, "categoryId": "co0", "note": "Telefonia", "date": "2022-08-01", "memberId": "1"}, {"id": "h1178", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2022-08-01", "memberId": "1"}, {"id": "h1179", "type": "out", "amount": 45.0, "categoryId": "co2", "note": "Benzina", "date": "2022-08-01", "memberId": "1"}, {"id": "h1180", "type": "out", "amount": 55.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2022-08-01", "memberId": "1"}, {"id": "h1181", "type": "out", "amount": 500.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2022-08-01", "memberId": "1"}, {"id": "h1182", "type": "out", "amount": 394.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2022-08-01", "memberId": "1"}, {"id": "h1183", "type": "out", "amount": 35.0, "categoryId": "co4", "note": "Netflix/Spotify", "date": "2022-08-01", "memberId": "1"}, {"id": "h1184", "type": "out", "amount": 5.0, "categoryId": "co4", "note": "Sigarette", "date": "2022-08-01", "memberId": "1"}, {"id": "h1185", "type": "out", "amount": 225.0, "categoryId": "co8", "note": "Psicologo", "date": "2022-08-01", "memberId": "1"}, {"id": "h1186", "type": "out", "amount": 145.0, "categoryId": "co8", "note": "Altro figli (mance, regali)", "date": "2022-08-01", "memberId": "1"}, {"id": "h1187", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2022-08-01", "memberId": "1"}, {"id": "h1188", "type": "out", "amount": 140.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2022-08-01", "memberId": "1"}, {"id": "h1189", "type": "out", "amount": 180.0, "categoryId": "co3", "note": "Dentista/Oculista", "date": "2022-08-01", "memberId": "1"}, {"id": "h1190", "type": "out", "amount": 640.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2022-08-01", "memberId": "1"}, {"id": "h1191", "type": "out", "amount": 60.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2022-08-01", "memberId": "1"}, {"id": "h1192", "type": "out", "amount": 20.0, "categoryId": "co3", "note": "Estetista/Fisioterapia/Massaggi", "date": "2022-08-01", "memberId": "1"}, {"id": "h1193", "type": "out", "amount": 1139.0, "categoryId": "co10", "note": "Viaggio", "date": "2022-08-01", "memberId": "1"}, {"id": "h1194", "type": "out", "amount": 123.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2022-08-01", "memberId": "1"}, {"id": "h1195", "type": "out", "amount": 45.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2022-08-01", "memberId": "1"}, {"id": "h1196", "type": "in", "amount": 1250.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2022-09-01", "memberId": "1"}, {"id": "h1197", "type": "in", "amount": 1045.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2022-09-01", "memberId": "1"}, {"id": "h1198", "type": "in", "amount": 500.0, "categoryId": "ci2", "note": "Affitti da case di proprietà", "date": "2022-09-01", "memberId": "1"}, {"id": "h1199", "type": "in", "amount": 400.0, "categoryId": "ci3", "note": "Dividendi da azioni", "date": "2022-09-01", "memberId": "1"}, {"id": "h1200", "type": "in", "amount": 250.0, "categoryId": "ci4", "note": "Risarcimenti ricevuti", "date": "2022-09-01", "memberId": "1"}, {"id": "h1201", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2022-09-01", "memberId": "1"}, {"id": "h1202", "type": "out", "amount": 31.5, "categoryId": "co0", "note": "Acqua", "date": "2022-09-01", "memberId": "1"}, {"id": "h1203", "type": "out", "amount": 165.0, "categoryId": "co0", "note": "Luce", "date": "2022-09-01", "memberId": "1"}, {"id": "h1204", "type": "out", "amount": 13.0, "categoryId": "co0", "note": "Telefonia", "date": "2022-09-01", "memberId": "1"}, {"id": "h1205", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2022-09-01", "memberId": "1"}, {"id": "h1206", "type": "out", "amount": 234.0, "categoryId": "co0", "note": "Imposte sugli immobili", "date": "2022-09-01", "memberId": "1"}, {"id": "h1207", "type": "out", "amount": 400.0, "categoryId": "co2", "note": "Assicurazione auto", "date": "2022-09-01", "memberId": "1"}, {"id": "h1208", "type": "out", "amount": 120.0, "categoryId": "co2", "note": "Benzina", "date": "2022-09-01", "memberId": "1"}, {"id": "h1209", "type": "out", "amount": 185.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2022-09-01", "memberId": "1"}, {"id": "h1210", "type": "out", "amount": 114.0, "categoryId": "co2", "note": "Bollo auto", "date": "2022-09-01", "memberId": "1"}, {"id": "h1211", "type": "out", "amount": 350.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2022-09-01", "memberId": "1"}, {"id": "h1212", "type": "out", "amount": 18.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2022-09-01", "memberId": "1"}, {"id": "h1213", "type": "out", "amount": 200.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2022-09-01", "memberId": "1"}, {"id": "h1214", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify", "date": "2022-09-01", "memberId": "1"}, {"id": "h1215", "type": "out", "amount": 5.0, "categoryId": "co3", "note": "Pesca", "date": "2022-09-01", "memberId": "1"}, {"id": "h1216", "type": "out", "amount": 70.0, "categoryId": "co4", "note": "Sigarette", "date": "2022-09-01", "memberId": "1"}, {"id": "h1217", "type": "out", "amount": 315.0, "categoryId": "co8", "note": "Psicologa", "date": "2022-09-01", "memberId": "1"}, {"id": "h1218", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2022-09-01", "memberId": "1"}, {"id": "h1219", "type": "out", "amount": 40.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2022-09-01", "memberId": "1"}, {"id": "h1220", "type": "out", "amount": 100.0, "categoryId": "co3", "note": "Dentista/Oculista", "date": "2022-09-01", "memberId": "1"}, {"id": "h1221", "type": "out", "amount": 111.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2022-09-01", "memberId": "1"}, {"id": "h1222", "type": "out", "amount": 65.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2022-09-01", "memberId": "1"}, {"id": "h1223", "type": "out", "amount": 55.0, "categoryId": "co3", "note": "Estetista/Fisioterapia/Massaggi", "date": "2022-09-01", "memberId": "1"}, {"id": "h1224", "type": "out", "amount": 6.0, "categoryId": "co10", "note": "Viaggio", "date": "2022-09-01", "memberId": "1"}, {"id": "h1225", "type": "out", "amount": 401.0, "categoryId": "co10", "note": "Hotel e pernottamento", "date": "2022-09-01", "memberId": "1"}, {"id": "h1226", "type": "out", "amount": 63.0, "categoryId": "co10", "note": "Spese in viaggio", "date": "2022-09-01", "memberId": "1"}, {"id": "h1227", "type": "out", "amount": 1078.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2022-09-01", "memberId": "1"}, {"id": "h1228", "type": "out", "amount": 110.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2022-09-01", "memberId": "1"}, {"id": "h1229", "type": "in", "amount": 450.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2022-10-01", "memberId": "1"}, {"id": "h1230", "type": "in", "amount": 876.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2022-10-01", "memberId": "1"}, {"id": "h1231", "type": "in", "amount": 400.0, "categoryId": "ci2", "note": "Affitti da case di proprietà", "date": "2022-10-01", "memberId": "1"}, {"id": "h1232", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2022-10-01", "memberId": "1"}, {"id": "h1233", "type": "out", "amount": 13.0, "categoryId": "co0", "note": "Telefonia", "date": "2022-10-01", "memberId": "1"}, {"id": "h1234", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2022-10-01", "memberId": "1"}, {"id": "h1235", "type": "out", "amount": 85.0, "categoryId": "co2", "note": "Benzina", "date": "2022-10-01", "memberId": "1"}, {"id": "h1236", "type": "out", "amount": 6.0, "categoryId": "co2", "note": "Autostrada", "date": "2022-10-01", "memberId": "1"}, {"id": "h1237", "type": "out", "amount": 446.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2022-10-01", "memberId": "1"}, {"id": "h1238", "type": "out", "amount": 48.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2022-10-01", "memberId": "1"}, {"id": "h1239", "type": "out", "amount": 34.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2022-10-01", "memberId": "1"}, {"id": "h1240", "type": "out", "amount": 161.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2022-10-01", "memberId": "1"}, {"id": "h1241", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify", "date": "2022-10-01", "memberId": "1"}, {"id": "h1242", "type": "out", "amount": 90.0, "categoryId": "co8", "note": "Psicologo", "date": "2022-10-01", "memberId": "1"}, {"id": "h1243", "type": "out", "amount": 90.0, "categoryId": "co8", "note": "Scuola figli (materiale, tasse)", "date": "2022-10-01", "memberId": "1"}, {"id": "h1244", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2022-10-01", "memberId": "1"}, {"id": "h1245", "type": "out", "amount": 40.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2022-10-01", "memberId": "1"}, {"id": "h1246", "type": "out", "amount": 40.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2022-10-01", "memberId": "1"}, {"id": "h1247", "type": "out", "amount": 10.0, "categoryId": "co3", "note": "Estetista/Fisioterapia/Massaggi", "date": "2022-10-01", "memberId": "1"}, {"id": "h1248", "type": "out", "amount": 85.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2022-10-01", "memberId": "1"}, {"id": "h1249", "type": "out", "amount": 43.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2022-10-01", "memberId": "1"}, {"id": "h1250", "type": "in", "amount": 500.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2022-11-01", "memberId": "1"}, {"id": "h1251", "type": "in", "amount": 1015.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2022-11-01", "memberId": "1"}, {"id": "h1252", "type": "in", "amount": 260.0, "categoryId": "ci2", "note": "Affitti da case di proprietà", "date": "2022-11-01", "memberId": "1"}, {"id": "h1253", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2022-11-01", "memberId": "1"}, {"id": "h1254", "type": "out", "amount": 50.0, "categoryId": "co0", "note": "Acqua", "date": "2022-11-01", "memberId": "1"}, {"id": "h1255", "type": "out", "amount": 105.0, "categoryId": "co0", "note": "Luce", "date": "2022-11-01", "memberId": "1"}, {"id": "h1256", "type": "out", "amount": 13.0, "categoryId": "co0", "note": "Telefonia", "date": "2022-11-01", "memberId": "1"}, {"id": "h1257", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2022-11-01", "memberId": "1"}, {"id": "h1258", "type": "out", "amount": 2500.0, "categoryId": "co2", "note": "Rate auto", "date": "2022-11-01", "memberId": "1"}, {"id": "h1259", "type": "out", "amount": 365.0, "categoryId": "co2", "note": "Assicurazione auto", "date": "2022-11-01", "memberId": "1"}, {"id": "h1260", "type": "out", "amount": 15.0, "categoryId": "co2", "note": "Benzina", "date": "2022-11-01", "memberId": "1"}, {"id": "h1261", "type": "out", "amount": 150.0, "categoryId": "co2", "note": "Bollo auto", "date": "2022-11-01", "memberId": "1"}, {"id": "h1262", "type": "out", "amount": 309.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2022-11-01", "memberId": "1"}, {"id": "h1263", "type": "out", "amount": 23.5, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2022-11-01", "memberId": "1"}, {"id": "h1264", "type": "out", "amount": 77.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2022-11-01", "memberId": "1"}, {"id": "h1265", "type": "out", "amount": 295.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2022-11-01", "memberId": "1"}, {"id": "h1266", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify", "date": "2022-11-01", "memberId": "1"}, {"id": "h1267", "type": "out", "amount": 72.0, "categoryId": "co4", "note": "Sigarette", "date": "2022-11-01", "memberId": "1"}, {"id": "h1268", "type": "out", "amount": 180.0, "categoryId": "co8", "note": "Psicologo", "date": "2022-11-01", "memberId": "1"}, {"id": "h1269", "type": "out", "amount": 220.0, "categoryId": "co8", "note": "Abbonamento trading view", "date": "2022-11-01", "memberId": "1"}, {"id": "h1270", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2022-11-01", "memberId": "1"}, {"id": "h1271", "type": "out", "amount": 18.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2022-11-01", "memberId": "1"}, {"id": "h1272", "type": "out", "amount": 35.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2022-11-01", "memberId": "1"}, {"id": "h1273", "type": "out", "amount": 10.0, "categoryId": "co3", "note": "Estetista/Fisioterapia/Massaggi", "date": "2022-11-01", "memberId": "1"}, {"id": "h1274", "type": "out", "amount": 609.0, "categoryId": "co10", "note": "Viaggio", "date": "2022-11-01", "memberId": "1"}, {"id": "h1275", "type": "out", "amount": 207.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2022-11-01", "memberId": "1"}, {"id": "h1276", "type": "out", "amount": 97.0, "categoryId": "co6", "note": "Istruzione e formazione personale", "date": "2022-11-01", "memberId": "1"}, {"id": "h1277", "type": "out", "amount": 56.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2022-11-01", "memberId": "1"}, {"id": "h1278", "type": "in", "amount": 500.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2022-12-01", "memberId": "1"}, {"id": "h1279", "type": "in", "amount": 1142.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2022-12-01", "memberId": "1"}, {"id": "h1280", "type": "in", "amount": 200.0, "categoryId": "ci2", "note": "Affitti da case di proprietà", "date": "2022-12-01", "memberId": "1"}, {"id": "h1281", "type": "in", "amount": 604.0, "categoryId": "ci3", "note": "Dividendi da azioni", "date": "2022-12-01", "memberId": "1"}, {"id": "h1282", "type": "in", "amount": 400.0, "categoryId": "ci4", "note": "Risarcimenti ricevuti", "date": "2022-12-01", "memberId": "1"}, {"id": "h1284", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2022-12-01", "memberId": "1"}, {"id": "h1285", "type": "out", "amount": 13.0, "categoryId": "co0", "note": "Telefonia", "date": "2022-12-01", "memberId": "1"}, {"id": "h1286", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2022-12-01", "memberId": "1"}, {"id": "h1287", "type": "out", "amount": 49.0, "categoryId": "co0", "note": "Imposte sugli immobili", "date": "2022-12-01", "memberId": "1"}, {"id": "h1288", "type": "out", "amount": 60.0, "categoryId": "co2", "note": "Benzina", "date": "2022-12-01", "memberId": "1"}, {"id": "h1289", "type": "out", "amount": 190.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2022-12-01", "memberId": "1"}, {"id": "h1290", "type": "out", "amount": 205.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2022-12-01", "memberId": "1"}, {"id": "h1291", "type": "out", "amount": 46.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2022-12-01", "memberId": "1"}, {"id": "h1292", "type": "out", "amount": 60.0, "categoryId": "co1", "note": "Caffè", "date": "2022-12-01", "memberId": "1"}, {"id": "h1293", "type": "out", "amount": 130.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2022-12-01", "memberId": "1"}, {"id": "h1294", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify", "date": "2022-12-01", "memberId": "1"}, {"id": "h1295", "type": "out", "amount": 180.0, "categoryId": "co8", "note": "Psicologo", "date": "2022-12-01", "memberId": "1"}, {"id": "h1296", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2022-12-01", "memberId": "1"}, {"id": "h1297", "type": "out", "amount": 40.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2022-12-01", "memberId": "1"}, {"id": "h1298", "type": "out", "amount": 196.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2022-12-01", "memberId": "1"}, {"id": "h1299", "type": "out", "amount": 10.0, "categoryId": "co3", "note": "Estetista/Fisioterapia/Massaggi", "date": "2022-12-01", "memberId": "1"}, {"id": "h1300", "type": "out", "amount": 488.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2022-12-01", "memberId": "1"}, {"id": "h1301", "type": "out", "amount": 104.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2022-12-01", "memberId": "1"}, {"id": "h1302", "type": "in", "amount": 917.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2023-01-01", "memberId": "1"}, {"id": "h1303", "type": "in", "amount": 450.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2023-01-01", "memberId": "1"}, {"id": "h1304", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2023-01-01", "memberId": "1"}, {"id": "h1305", "type": "out", "amount": 187.0, "categoryId": "co0", "note": "Luce", "date": "2023-01-01", "memberId": "1"}, {"id": "h1306", "type": "out", "amount": 16.0, "categoryId": "co0", "note": "Telefonia", "date": "2023-01-01", "memberId": "1"}, {"id": "h1307", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2023-01-01", "memberId": "1"}, {"id": "h1308", "type": "out", "amount": 65.0, "categoryId": "co2", "note": "Benzina", "date": "2023-01-01", "memberId": "1"}, {"id": "h1309", "type": "out", "amount": 348.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2023-01-01", "memberId": "1"}, {"id": "h1310", "type": "out", "amount": 206.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2023-01-01", "memberId": "1"}, {"id": "h1311", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2023-01-01", "memberId": "1"}, {"id": "h1312", "type": "out", "amount": 135.0, "categoryId": "co3", "note": "Psicologo", "date": "2023-01-01", "memberId": "1"}, {"id": "h1313", "type": "out", "amount": 64.0, "categoryId": "co4", "note": "Sigarette", "date": "2023-01-01", "memberId": "1"}, {"id": "h1314", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2023-01-01", "memberId": "1"}, {"id": "h1315", "type": "out", "amount": 68.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2023-01-01", "memberId": "1"}, {"id": "h1316", "type": "out", "amount": 208.0, "categoryId": "co3", "note": "Dentista/Oculista/Dermatologa", "date": "2023-01-01", "memberId": "1"}, {"id": "h1317", "type": "out", "amount": 20.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2023-01-01", "memberId": "1"}, {"id": "h1318", "type": "out", "amount": 2281.0, "categoryId": "co10", "note": "Spese casa", "date": "2023-01-01", "memberId": "1"}, {"id": "h1319", "type": "out", "amount": 42.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2023-01-01", "memberId": "1"}, {"id": "h1320", "type": "in", "amount": 869.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2023-02-01", "memberId": "1"}, {"id": "h1321", "type": "in", "amount": 800.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2023-02-01", "memberId": "1"}, {"id": "h1322", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2023-02-01", "memberId": "1"}, {"id": "h1323", "type": "out", "amount": 16.0, "categoryId": "co0", "note": "Telefonia", "date": "2023-02-01", "memberId": "1"}, {"id": "h1324", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2023-02-01", "memberId": "1"}, {"id": "h1325", "type": "out", "amount": 450.0, "categoryId": "co2", "note": "Assicurazione auto", "date": "2023-02-01", "memberId": "1"}, {"id": "h1326", "type": "out", "amount": 112.0, "categoryId": "co2", "note": "Benzina", "date": "2023-02-01", "memberId": "1"}, {"id": "h1327", "type": "out", "amount": 30.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2023-02-01", "memberId": "1"}, {"id": "h1328", "type": "out", "amount": 20.0, "categoryId": "co2", "note": "Bollo auto", "date": "2023-02-01", "memberId": "1"}, {"id": "h1329", "type": "out", "amount": 395.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2023-02-01", "memberId": "1"}, {"id": "h1330", "type": "out", "amount": 51.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2023-02-01", "memberId": "1"}, {"id": "h1331", "type": "out", "amount": 21.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2023-02-01", "memberId": "1"}, {"id": "h1332", "type": "out", "amount": 29.0, "categoryId": "co1", "note": "Caffè", "date": "2023-02-01", "memberId": "1"}, {"id": "h1333", "type": "out", "amount": 66.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2023-02-01", "memberId": "1"}, {"id": "h1334", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2023-02-01", "memberId": "1"}, {"id": "h1335", "type": "out", "amount": 130.0, "categoryId": "co3", "note": "Psicologo", "date": "2023-02-01", "memberId": "1"}, {"id": "h1336", "type": "out", "amount": 107.0, "categoryId": "co4", "note": "Sigarette", "date": "2023-02-01", "memberId": "1"}, {"id": "h1337", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2023-02-01", "memberId": "1"}, {"id": "h1338", "type": "out", "amount": 40.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2023-02-01", "memberId": "1"}, {"id": "h1339", "type": "out", "amount": 115.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2023-02-01", "memberId": "1"}, {"id": "h1340", "type": "out", "amount": 140.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2023-02-01", "memberId": "1"}, {"id": "h1341", "type": "out", "amount": 10.0, "categoryId": "co3", "note": "Estetista/Fisioterapia/Massaggi", "date": "2023-02-01", "memberId": "1"}, {"id": "h1342", "type": "out", "amount": 7.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2023-02-01", "memberId": "1"}, {"id": "h1343", "type": "out", "amount": 4000.0, "categoryId": "co6", "note": "Istruzione e formazione personale", "date": "2023-02-01", "memberId": "1"}, {"id": "h1344", "type": "out", "amount": 55.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2023-02-01", "memberId": "1"}, {"id": "h1345", "type": "in", "amount": 444.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2023-03-01", "memberId": "1"}, {"id": "h1346", "type": "in", "amount": 897.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2023-03-01", "memberId": "1"}, {"id": "h1349", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2023-03-01", "memberId": "1"}, {"id": "h1350", "type": "out", "amount": 15.0, "categoryId": "co0", "note": "Dati TVW", "date": "2023-03-01", "memberId": "1"}, {"id": "h1351", "type": "out", "amount": 83.9, "categoryId": "co0", "note": "Acqua", "date": "2023-03-01", "memberId": "1"}, {"id": "h1352", "type": "out", "amount": 196.0, "categoryId": "co0", "note": "Luce", "date": "2023-03-01", "memberId": "1"}, {"id": "h1353", "type": "out", "amount": 16.0, "categoryId": "co0", "note": "Telefonia", "date": "2023-03-01", "memberId": "1"}, {"id": "h1354", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2023-03-01", "memberId": "1"}, {"id": "h1355", "type": "out", "amount": 80.0, "categoryId": "co2", "note": "Benzina", "date": "2023-03-01", "memberId": "1"}, {"id": "h1356", "type": "out", "amount": 380.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2023-03-01", "memberId": "1"}, {"id": "h1357", "type": "out", "amount": 376.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2023-03-01", "memberId": "1"}, {"id": "h1358", "type": "out", "amount": 18.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2023-03-01", "memberId": "1"}, {"id": "h1359", "type": "out", "amount": 34.0, "categoryId": "co1", "note": "Caffè", "date": "2023-03-01", "memberId": "1"}, {"id": "h1360", "type": "out", "amount": 92.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2023-03-01", "memberId": "1"}, {"id": "h1361", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2023-03-01", "memberId": "1"}, {"id": "h1362", "type": "out", "amount": 135.0, "categoryId": "co3", "note": "Psicologo", "date": "2023-03-01", "memberId": "1"}, {"id": "h1363", "type": "out", "amount": 79.0, "categoryId": "co4", "note": "Sigarette", "date": "2023-03-01", "memberId": "1"}, {"id": "h1364", "type": "out", "amount": 202.0, "categoryId": "co4", "note": "Altro/cucito", "date": "2023-03-01", "memberId": "1"}, {"id": "h1365", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2023-03-01", "memberId": "1"}, {"id": "h1366", "type": "out", "amount": 209.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2023-03-01", "memberId": "1"}, {"id": "h1367", "type": "out", "amount": 410.0, "categoryId": "co3", "note": "Dentista/Oculista/Dermatologa", "date": "2023-03-01", "memberId": "1"}, {"id": "h1368", "type": "out", "amount": 45.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2023-03-01", "memberId": "1"}, {"id": "h1369", "type": "out", "amount": 40.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2023-03-01", "memberId": "1"}, {"id": "h1370", "type": "out", "amount": 50.0, "categoryId": "co3", "note": "Estetista/Fisioterapia/Massaggi", "date": "2023-03-01", "memberId": "1"}, {"id": "h1371", "type": "out", "amount": 410.0, "categoryId": "co10", "note": "Viaggio", "date": "2023-03-01", "memberId": "1"}, {"id": "h1372", "type": "out", "amount": 52.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2023-03-01", "memberId": "1"}, {"id": "h1373", "type": "out", "amount": 67.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2023-03-01", "memberId": "1"}, {"id": "h1374", "type": "in", "amount": 544.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2023-04-01", "memberId": "1"}, {"id": "h1375", "type": "in", "amount": 841.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2023-04-01", "memberId": "1"}, {"id": "h1376", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2023-04-01", "memberId": "1"}, {"id": "h1377", "type": "out", "amount": 102.86, "categoryId": "co0", "note": "Luce", "date": "2023-04-01", "memberId": "1"}, {"id": "h1378", "type": "out", "amount": 16.0, "categoryId": "co0", "note": "Telefonia", "date": "2023-04-01", "memberId": "1"}, {"id": "h1379", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2023-04-01", "memberId": "1"}, {"id": "h1380", "type": "out", "amount": 112.0, "categoryId": "co2", "note": "Benzina", "date": "2023-04-01", "memberId": "1"}, {"id": "h1381", "type": "out", "amount": 10.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2023-04-01", "memberId": "1"}, {"id": "h1382", "type": "out", "amount": 5.0, "categoryId": "co2", "note": "Mezzi pubblici e taxi", "date": "2023-04-01", "memberId": "1"}, {"id": "h1383", "type": "out", "amount": 238.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2023-04-01", "memberId": "1"}, {"id": "h1384", "type": "out", "amount": 14.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2023-04-01", "memberId": "1"}, {"id": "h1385", "type": "out", "amount": 50.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2023-04-01", "memberId": "1"}, {"id": "h1386", "type": "out", "amount": 20.0, "categoryId": "co1", "note": "Caffè", "date": "2023-04-01", "memberId": "1"}, {"id": "h1387", "type": "out", "amount": 200.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2023-04-01", "memberId": "1"}, {"id": "h1388", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2023-04-01", "memberId": "1"}, {"id": "h1389", "type": "out", "amount": 225.0, "categoryId": "co3", "note": "Psicologo", "date": "2023-04-01", "memberId": "1"}, {"id": "h1390", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2023-04-01", "memberId": "1"}, {"id": "h1391", "type": "out", "amount": 20.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2023-04-01", "memberId": "1"}, {"id": "h1392", "type": "out", "amount": 70.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2023-04-01", "memberId": "1"}, {"id": "h1393", "type": "out", "amount": 35.0, "categoryId": "co3", "note": "Estetista/Fisioterapia/Massaggi", "date": "2023-04-01", "memberId": "1"}, {"id": "h1394", "type": "out", "amount": 110.0, "categoryId": "co10", "note": "Spese in viaggio", "date": "2023-04-01", "memberId": "1"}, {"id": "h1395", "type": "out", "amount": 60.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2023-04-01", "memberId": "1"}, {"id": "h1396", "type": "out", "amount": 1047.0, "categoryId": "co6", "note": "Istruzione e formazione personale", "date": "2023-04-01", "memberId": "1"}, {"id": "h1397", "type": "out", "amount": 43.87, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2023-04-01", "memberId": "1"}, {"id": "h1398", "type": "in", "amount": 1010.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2023-05-01", "memberId": "1"}, {"id": "h1399", "type": "in", "amount": 406.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2023-05-01", "memberId": "1"}, {"id": "h1400", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2023-05-01", "memberId": "1"}, {"id": "h1401", "type": "out", "amount": 16.0, "categoryId": "co0", "note": "Telefonia", "date": "2023-05-01", "memberId": "1"}, {"id": "h1402", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2023-05-01", "memberId": "1"}, {"id": "h1403", "type": "out", "amount": 20.0, "categoryId": "co0", "note": "Manutenzione/Riparazioni", "date": "2023-05-01", "memberId": "1"}, {"id": "h1404", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Arredamento ed elettrodomestici", "date": "2023-05-01", "memberId": "1"}, {"id": "h1405", "type": "out", "amount": 90.0, "categoryId": "co2", "note": "Assicurazione auto", "date": "2023-05-01", "memberId": "1"}, {"id": "h1406", "type": "out", "amount": 127.0, "categoryId": "co2", "note": "Benzina", "date": "2023-05-01", "memberId": "1"}, {"id": "h1407", "type": "out", "amount": 470.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2023-05-01", "memberId": "1"}, {"id": "h1408", "type": "out", "amount": 152.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2023-05-01", "memberId": "1"}, {"id": "h1409", "type": "out", "amount": 114.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2023-05-01", "memberId": "1"}, {"id": "h1410", "type": "out", "amount": 36.0, "categoryId": "co1", "note": "Caffè", "date": "2023-05-01", "memberId": "1"}, {"id": "h1411", "type": "out", "amount": 136.5, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2023-05-01", "memberId": "1"}, {"id": "h1412", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2023-05-01", "memberId": "1"}, {"id": "h1413", "type": "out", "amount": 180.0, "categoryId": "co3", "note": "Psicologo", "date": "2023-05-01", "memberId": "1"}, {"id": "h1414", "type": "out", "amount": 21.0, "categoryId": "co4", "note": "Sigarette", "date": "2023-05-01", "memberId": "1"}, {"id": "h1415", "type": "out", "amount": 1200.0, "categoryId": "co4", "note": "F24 contributi", "date": "2023-05-01", "memberId": "1"}, {"id": "h1416", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2023-05-01", "memberId": "1"}, {"id": "h1417", "type": "out", "amount": 90.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2023-05-01", "memberId": "1"}, {"id": "h1418", "type": "out", "amount": 70.0, "categoryId": "co3", "note": "Dentista/Oculista/Dermatologa", "date": "2023-05-01", "memberId": "1"}, {"id": "h1419", "type": "out", "amount": 10.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2023-05-01", "memberId": "1"}, {"id": "h1420", "type": "out", "amount": 40.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2023-05-01", "memberId": "1"}, {"id": "h1421", "type": "out", "amount": 5.0, "categoryId": "co3", "note": "Estetista/Fisioterapia/Massaggi", "date": "2023-05-01", "memberId": "1"}, {"id": "h1422", "type": "out", "amount": 84.0, "categoryId": "co10", "note": "Viaggio", "date": "2023-05-01", "memberId": "1"}, {"id": "h1423", "type": "out", "amount": 95.0, "categoryId": "co10", "note": "Hotel e pernottamento", "date": "2023-05-01", "memberId": "1"}, {"id": "h1424", "type": "out", "amount": 102.0, "categoryId": "co10", "note": "Spese in viaggio", "date": "2023-05-01", "memberId": "1"}, {"id": "h1425", "type": "out", "amount": 250.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2023-05-01", "memberId": "1"}, {"id": "h1426", "type": "out", "amount": 70.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2023-05-01", "memberId": "1"}, {"id": "h1427", "type": "in", "amount": 1250.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2023-06-01", "memberId": "1"}, {"id": "h1428", "type": "in", "amount": 649.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2023-06-01", "memberId": "1"}, {"id": "h1429", "type": "in", "amount": 85.0, "categoryId": "ci2", "note": "Affitti da case di proprietà", "date": "2023-06-01", "memberId": "1"}, {"id": "h1430", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2023-06-01", "memberId": "1"}, {"id": "h1431", "type": "out", "amount": 46.5, "categoryId": "co0", "note": "Acqua", "date": "2023-06-01", "memberId": "1"}, {"id": "h1432", "type": "out", "amount": 226.0, "categoryId": "co0", "note": "Luce", "date": "2023-06-01", "memberId": "1"}, {"id": "h1433", "type": "out", "amount": 16.0, "categoryId": "co0", "note": "Telefonia", "date": "2023-06-01", "memberId": "1"}, {"id": "h1434", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2023-06-01", "memberId": "1"}, {"id": "h1435", "type": "out", "amount": 49.0, "categoryId": "co0", "note": "Imposte sugli immobili", "date": "2023-06-01", "memberId": "1"}, {"id": "h1436", "type": "out", "amount": 42.0, "categoryId": "co2", "note": "Benzina", "date": "2023-06-01", "memberId": "1"}, {"id": "h1437", "type": "out", "amount": 15.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2023-06-01", "memberId": "1"}, {"id": "h1438", "type": "out", "amount": 354.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2023-06-01", "memberId": "1"}, {"id": "h1439", "type": "out", "amount": 26.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2023-06-01", "memberId": "1"}, {"id": "h1440", "type": "out", "amount": 19.0, "categoryId": "co1", "note": "Caffè", "date": "2023-06-01", "memberId": "1"}, {"id": "h1441", "type": "out", "amount": 154.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2023-06-01", "memberId": "1"}, {"id": "h1442", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2023-06-01", "memberId": "1"}, {"id": "h1443", "type": "out", "amount": 180.0, "categoryId": "co3", "note": "Psicologo", "date": "2023-06-01", "memberId": "1"}, {"id": "h1444", "type": "out", "amount": 56.5, "categoryId": "co4", "note": "Sigarette", "date": "2023-06-01", "memberId": "1"}, {"id": "h1445", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2023-06-01", "memberId": "1"}, {"id": "h1446", "type": "out", "amount": 20.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2023-06-01", "memberId": "1"}, {"id": "h1447", "type": "out", "amount": 32.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2023-06-01", "memberId": "1"}, {"id": "h1448", "type": "out", "amount": 160.0, "categoryId": "co3", "note": "Estetista/Fisioterapia/Massaggi", "date": "2023-06-01", "memberId": "1"}, {"id": "h1449", "type": "out", "amount": 350.0, "categoryId": "co10", "note": "Viaggio", "date": "2023-06-01", "memberId": "1"}, {"id": "h1450", "type": "out", "amount": 230.0, "categoryId": "co10", "note": "Hotel e pernottamento", "date": "2023-06-01", "memberId": "1"}, {"id": "h1451", "type": "out", "amount": 25.0, "categoryId": "co10", "note": "Spese in viaggio", "date": "2023-06-01", "memberId": "1"}, {"id": "h1452", "type": "out", "amount": 25.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2023-06-01", "memberId": "1"}, {"id": "h1453", "type": "out", "amount": 127.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2023-06-01", "memberId": "1"}, {"id": "h1454", "type": "in", "amount": 1870.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2023-07-01", "memberId": "1"}, {"id": "h1455", "type": "in", "amount": 530.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2023-07-01", "memberId": "1"}, {"id": "h1456", "type": "in", "amount": 969.0, "categoryId": "ci2", "note": "Affitti da case di proprietà", "date": "2023-07-01", "memberId": "1"}, {"id": "h1457", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2023-07-01", "memberId": "1"}, {"id": "h1458", "type": "out", "amount": 16.0, "categoryId": "co0", "note": "Telefonia", "date": "2023-07-01", "memberId": "1"}, {"id": "h1459", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2023-07-01", "memberId": "1"}, {"id": "h1460", "type": "out", "amount": 233.0, "categoryId": "co0", "note": "Imposte sugli immobili", "date": "2023-07-01", "memberId": "1"}, {"id": "h1461", "type": "out", "amount": 146.0, "categoryId": "co2", "note": "Benzina", "date": "2023-07-01", "memberId": "1"}, {"id": "h1462", "type": "out", "amount": 310.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2023-07-01", "memberId": "1"}, {"id": "h1463", "type": "out", "amount": 29.0, "categoryId": "co2", "note": "Mezzi pubblici e taxi", "date": "2023-07-01", "memberId": "1"}, {"id": "h1464", "type": "out", "amount": 268.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2023-07-01", "memberId": "1"}, {"id": "h1465", "type": "out", "amount": 21.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2023-07-01", "memberId": "1"}, {"id": "h1466", "type": "out", "amount": 23.0, "categoryId": "co1", "note": "Caffè", "date": "2023-07-01", "memberId": "1"}, {"id": "h1467", "type": "out", "amount": 637.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2023-07-01", "memberId": "1"}, {"id": "h1468", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2023-07-01", "memberId": "1"}, {"id": "h1469", "type": "out", "amount": 90.0, "categoryId": "co3", "note": "Psicologo", "date": "2023-07-01", "memberId": "1"}, {"id": "h1470", "type": "out", "amount": 42.0, "categoryId": "co4", "note": "Sigarette", "date": "2023-07-01", "memberId": "1"}, {"id": "h1471", "type": "out", "amount": 70.0, "categoryId": "co8", "note": "Meditopia", "date": "2023-07-01", "memberId": "1"}, {"id": "h1472", "type": "out", "amount": 20.0, "categoryId": "co9", "note": "Sport", "date": "2023-07-01", "memberId": "1"}, {"id": "h1473", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2023-07-01", "memberId": "1"}, {"id": "h1474", "type": "out", "amount": 102.0, "categoryId": "co3", "note": "Dentista/Oculista/Dermatologa", "date": "2023-07-01", "memberId": "1"}, {"id": "h1475", "type": "out", "amount": 20.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2023-07-01", "memberId": "1"}, {"id": "h1476", "type": "out", "amount": 10.0, "categoryId": "co3", "note": "Estetista/Fisioterapia/Massaggi", "date": "2023-07-01", "memberId": "1"}, {"id": "h1477", "type": "out", "amount": 28.0, "categoryId": "co10", "note": "Viaggio", "date": "2023-07-01", "memberId": "1"}, {"id": "h1478", "type": "out", "amount": 190.5, "categoryId": "co10", "note": "Spese in viaggio", "date": "2023-07-01", "memberId": "1"}, {"id": "h1479", "type": "out", "amount": 504.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2023-07-01", "memberId": "1"}, {"id": "h1480", "type": "out", "amount": 6.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2023-07-01", "memberId": "1"}, {"id": "h1481", "type": "in", "amount": 1200.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2023-08-01", "memberId": "1"}, {"id": "h1482", "type": "in", "amount": 115.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2023-08-01", "memberId": "1"}, {"id": "h1483", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2023-08-01", "memberId": "1"}, {"id": "h1484", "type": "out", "amount": 224.0, "categoryId": "co0", "note": "Luce", "date": "2023-08-01", "memberId": "1"}, {"id": "h1485", "type": "out", "amount": 16.0, "categoryId": "co0", "note": "Telefonia", "date": "2023-08-01", "memberId": "1"}, {"id": "h1486", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2023-08-01", "memberId": "1"}, {"id": "h1487", "type": "out", "amount": 60.0, "categoryId": "co0", "note": "Manutenzione/Riparazioni", "date": "2023-08-01", "memberId": "1"}, {"id": "h1488", "type": "out", "amount": 117.0, "categoryId": "co0", "note": "Arredamento ed elettrodomestici", "date": "2023-08-01", "memberId": "1"}, {"id": "h1489", "type": "out", "amount": 120.0, "categoryId": "co2", "note": "Benzina", "date": "2023-08-01", "memberId": "1"}, {"id": "h1490", "type": "out", "amount": 8.0, "categoryId": "co2", "note": "Parcheggi", "date": "2023-08-01", "memberId": "1"}, {"id": "h1491", "type": "out", "amount": 5.0, "categoryId": "co2", "note": "Mezzi pubblici e taxi", "date": "2023-08-01", "memberId": "1"}, {"id": "h1492", "type": "out", "amount": 442.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2023-08-01", "memberId": "1"}, {"id": "h1493", "type": "out", "amount": 10.4, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2023-08-01", "memberId": "1"}, {"id": "h1494", "type": "out", "amount": 65.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2023-08-01", "memberId": "1"}, {"id": "h1495", "type": "out", "amount": 21.0, "categoryId": "co1", "note": "Caffè", "date": "2023-08-01", "memberId": "1"}, {"id": "h1496", "type": "out", "amount": 242.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2023-08-01", "memberId": "1"}, {"id": "h1497", "type": "out", "amount": 32.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2023-08-01", "memberId": "1"}, {"id": "h1498", "type": "out", "amount": 180.0, "categoryId": "co3", "note": "Psicologo", "date": "2023-08-01", "memberId": "1"}, {"id": "h1499", "type": "out", "amount": 71.0, "categoryId": "co4", "note": "Sigarette", "date": "2023-08-01", "memberId": "1"}, {"id": "h1500", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2023-08-01", "memberId": "1"}, {"id": "h1501", "type": "out", "amount": 50.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2023-08-01", "memberId": "1"}, {"id": "h1502", "type": "out", "amount": 135.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2023-08-01", "memberId": "1"}, {"id": "h1503", "type": "out", "amount": 90.0, "categoryId": "co3", "note": "Estetista/Fisioterapia/Massaggi", "date": "2023-08-01", "memberId": "1"}, {"id": "h1504", "type": "out", "amount": 325.0, "categoryId": "co10", "note": "Viaggio", "date": "2023-08-01", "memberId": "1"}, {"id": "h1505", "type": "out", "amount": 22.0, "categoryId": "co10", "note": "Hotel e pernottamento", "date": "2023-08-01", "memberId": "1"}, {"id": "h1506", "type": "out", "amount": 16.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2023-08-01", "memberId": "1"}, {"id": "h1507", "type": "out", "amount": 100.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2023-08-01", "memberId": "1"}, {"id": "h1508", "type": "in", "amount": 1043.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2023-09-01", "memberId": "1"}, {"id": "h1509", "type": "in", "amount": 685.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2023-09-01", "memberId": "1"}, {"id": "h1510", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2023-09-01", "memberId": "1"}, {"id": "h1511", "type": "out", "amount": 46.0, "categoryId": "co0", "note": "Acqua", "date": "2023-09-01", "memberId": "1"}, {"id": "h1512", "type": "out", "amount": 16.0, "categoryId": "co0", "note": "Telefonia", "date": "2023-09-01", "memberId": "1"}, {"id": "h1513", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2023-09-01", "memberId": "1"}, {"id": "h1514", "type": "out", "amount": 100.0, "categoryId": "co2", "note": "Benzina", "date": "2023-09-01", "memberId": "1"}, {"id": "h1515", "type": "out", "amount": 7.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2023-09-01", "memberId": "1"}, {"id": "h1516", "type": "out", "amount": 241.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2023-09-01", "memberId": "1"}, {"id": "h1517", "type": "out", "amount": 106.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2023-09-01", "memberId": "1"}, {"id": "h1518", "type": "out", "amount": 17.99, "categoryId": "co1", "note": "Caffè", "date": "2023-09-01", "memberId": "1"}, {"id": "h1519", "type": "out", "amount": 122.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2023-09-01", "memberId": "1"}, {"id": "h1520", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2023-09-01", "memberId": "1"}, {"id": "h1521", "type": "out", "amount": 135.0, "categoryId": "co3", "note": "Psicologo", "date": "2023-09-01", "memberId": "1"}, {"id": "h1522", "type": "out", "amount": 85.0, "categoryId": "co4", "note": "Sigarette", "date": "2023-09-01", "memberId": "1"}, {"id": "h1523", "type": "out", "amount": 79.0, "categoryId": "co4", "note": "E-commerce", "date": "2023-09-01", "memberId": "1"}, {"id": "h1524", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2023-09-01", "memberId": "1"}, {"id": "h1525", "type": "out", "amount": 50.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2023-09-01", "memberId": "1"}, {"id": "h1526", "type": "out", "amount": 50.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2023-09-01", "memberId": "1"}, {"id": "h1527", "type": "out", "amount": 12.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2023-09-01", "memberId": "1"}, {"id": "h1528", "type": "out", "amount": 27.0, "categoryId": "co10", "note": "Viaggio", "date": "2023-09-01", "memberId": "1"}, {"id": "h1529", "type": "out", "amount": 40.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2023-09-01", "memberId": "1"}, {"id": "h1530", "type": "in", "amount": 946.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2023-10-01", "memberId": "1"}, {"id": "h1531", "type": "in", "amount": 1098.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2023-10-01", "memberId": "1"}, {"id": "h1532", "type": "in", "amount": 450.0, "categoryId": "ci2", "note": "Affitti da case di proprietà", "date": "2023-10-01", "memberId": "1"}, {"id": "h1533", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2023-10-01", "memberId": "1"}, {"id": "h1534", "type": "out", "amount": 166.0, "categoryId": "co0", "note": "Luce", "date": "2023-10-01", "memberId": "1"}, {"id": "h1535", "type": "out", "amount": 16.0, "categoryId": "co0", "note": "Telefonia", "date": "2023-10-01", "memberId": "1"}, {"id": "h1536", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2023-10-01", "memberId": "1"}, {"id": "h1537", "type": "out", "amount": 110.0, "categoryId": "co2", "note": "Benzina", "date": "2023-10-01", "memberId": "1"}, {"id": "h1538", "type": "out", "amount": 200.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2023-10-01", "memberId": "1"}, {"id": "h1539", "type": "out", "amount": 115.0, "categoryId": "co2", "note": "Bollo auto", "date": "2023-10-01", "memberId": "1"}, {"id": "h1540", "type": "out", "amount": 143.0, "categoryId": "co2", "note": "Telo inverno scooter", "date": "2023-10-01", "memberId": "1"}, {"id": "h1541", "type": "out", "amount": 379.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2023-10-01", "memberId": "1"}, {"id": "h1542", "type": "out", "amount": 81.3, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2023-10-01", "memberId": "1"}, {"id": "h1543", "type": "out", "amount": 20.0, "categoryId": "co1", "note": "Caffè", "date": "2023-10-01", "memberId": "1"}, {"id": "h1544", "type": "out", "amount": 242.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2023-10-01", "memberId": "1"}, {"id": "h1545", "type": "out", "amount": 85.0, "categoryId": "co4", "note": "Cinema/Concerti/Teatro", "date": "2023-10-01", "memberId": "1"}, {"id": "h1546", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2023-10-01", "memberId": "1"}, {"id": "h1547", "type": "out", "amount": 180.0, "categoryId": "co3", "note": "Psicologo", "date": "2023-10-01", "memberId": "1"}, {"id": "h1548", "type": "out", "amount": 85.0, "categoryId": "co4", "note": "Sigarette", "date": "2023-10-01", "memberId": "1"}, {"id": "h1549", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2023-10-01", "memberId": "1"}, {"id": "h1550", "type": "out", "amount": 230.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2023-10-01", "memberId": "1"}, {"id": "h1551", "type": "out", "amount": 128.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2023-10-01", "memberId": "1"}, {"id": "h1552", "type": "out", "amount": 89.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2023-10-01", "memberId": "1"}, {"id": "h1553", "type": "in", "amount": 862.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2023-11-01", "memberId": "1"}, {"id": "h1554", "type": "in", "amount": 25.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2023-11-01", "memberId": "1"}, {"id": "h1555", "type": "in", "amount": 730.0, "categoryId": "ci2", "note": "Affitti da case di proprietà", "date": "2023-11-01", "memberId": "1"}, {"id": "h1556", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2023-11-01", "memberId": "1"}, {"id": "h1557", "type": "out", "amount": 16.0, "categoryId": "co0", "note": "Telefonia", "date": "2023-11-01", "memberId": "1"}, {"id": "h1558", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2023-11-01", "memberId": "1"}, {"id": "h1559", "type": "out", "amount": 395.0, "categoryId": "co2", "note": "Assicurazione auto", "date": "2023-11-01", "memberId": "1"}, {"id": "h1560", "type": "out", "amount": 56.0, "categoryId": "co2", "note": "Benzina", "date": "2023-11-01", "memberId": "1"}, {"id": "h1561", "type": "out", "amount": 370.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2023-11-01", "memberId": "1"}, {"id": "h1562", "type": "out", "amount": 430.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2023-11-01", "memberId": "1"}, {"id": "h1563", "type": "out", "amount": 42.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2023-11-01", "memberId": "1"}, {"id": "h1564", "type": "out", "amount": 9.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2023-11-01", "memberId": "1"}, {"id": "h1565", "type": "out", "amount": 80.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2023-11-01", "memberId": "1"}, {"id": "h1566", "type": "out", "amount": 4.5, "categoryId": "co4", "note": "Cinema/Concerti/Teatro", "date": "2023-11-01", "memberId": "1"}, {"id": "h1567", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2023-11-01", "memberId": "1"}, {"id": "h1568", "type": "out", "amount": 45.0, "categoryId": "co3", "note": "Psicologo", "date": "2023-11-01", "memberId": "1"}, {"id": "h1569", "type": "out", "amount": 83.0, "categoryId": "co4", "note": "Sigarette", "date": "2023-11-01", "memberId": "1"}, {"id": "h1570", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2023-11-01", "memberId": "1"}, {"id": "h1571", "type": "out", "amount": 50.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2023-11-01", "memberId": "1"}, {"id": "h1572", "type": "out", "amount": 150.0, "categoryId": "co3", "note": "Dentista/Oculista/Dermatologa", "date": "2023-11-01", "memberId": "1"}, {"id": "h1573", "type": "out", "amount": 382.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2023-11-01", "memberId": "1"}, {"id": "h1574", "type": "out", "amount": 46.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2023-11-01", "memberId": "1"}, {"id": "h1575", "type": "in", "amount": 1533.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2023-12-01", "memberId": "1"}, {"id": "h1576", "type": "in", "amount": 948.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2023-12-01", "memberId": "1"}, {"id": "h1578", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2023-12-01", "memberId": "1"}, {"id": "h1579", "type": "out", "amount": 38.0, "categoryId": "co0", "note": "Acqua", "date": "2023-12-01", "memberId": "1"}, {"id": "h1580", "type": "out", "amount": 190.0, "categoryId": "co0", "note": "Luce", "date": "2023-12-01", "memberId": "1"}, {"id": "h1581", "type": "out", "amount": 16.0, "categoryId": "co0", "note": "Telefonia", "date": "2023-12-01", "memberId": "1"}, {"id": "h1582", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Internet", "date": "2023-12-01", "memberId": "1"}, {"id": "h1583", "type": "out", "amount": 52.0, "categoryId": "co2", "note": "Benzina", "date": "2023-12-01", "memberId": "1"}, {"id": "h1584", "type": "out", "amount": 10.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2023-12-01", "memberId": "1"}, {"id": "h1585", "type": "out", "amount": 0.62, "categoryId": "co2", "note": "Parcheggi", "date": "2023-12-01", "memberId": "1"}, {"id": "h1586", "type": "out", "amount": 420.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2023-12-01", "memberId": "1"}, {"id": "h1587", "type": "out", "amount": 116.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2023-12-01", "memberId": "1"}, {"id": "h1588", "type": "out", "amount": 64.0, "categoryId": "co1", "note": "Caffè", "date": "2023-12-01", "memberId": "1"}, {"id": "h1589", "type": "out", "amount": 45.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2023-12-01", "memberId": "1"}, {"id": "h1590", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2023-12-01", "memberId": "1"}, {"id": "h1591", "type": "out", "amount": 45.0, "categoryId": "co3", "note": "Psicologo", "date": "2023-12-01", "memberId": "1"}, {"id": "h1592", "type": "out", "amount": 82.0, "categoryId": "co4", "note": "Sigarette", "date": "2023-12-01", "memberId": "1"}, {"id": "h1593", "type": "out", "amount": 90.0, "categoryId": "co8", "note": "Terapia", "date": "2023-12-01", "memberId": "1"}, {"id": "h1594", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2023-12-01", "memberId": "1"}, {"id": "h1595", "type": "out", "amount": 20.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2023-12-01", "memberId": "1"}, {"id": "h1596", "type": "out", "amount": 22.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2023-12-01", "memberId": "1"}, {"id": "h1597", "type": "out", "amount": 41.0, "categoryId": "co3", "note": "Prodotti unghie/Fisioterapia/Massaggi", "date": "2023-12-01", "memberId": "1"}, {"id": "h1598", "type": "out", "amount": 88.0, "categoryId": "co10", "note": "Hotel e pernottamento", "date": "2023-12-01", "memberId": "1"}, {"id": "h1599", "type": "out", "amount": 15.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2023-12-01", "memberId": "1"}, {"id": "h1600", "type": "out", "amount": 125.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2023-12-01", "memberId": "1"}, {"id": "h1601", "type": "in", "amount": 881.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2024-01-01", "memberId": "1"}, {"id": "h1602", "type": "in", "amount": 869.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2024-01-01", "memberId": "1"}, {"id": "h1603", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2024-01-01", "memberId": "1"}, {"id": "h1604", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2024-01-01", "memberId": "1"}, {"id": "h1605", "type": "out", "amount": 136.0, "categoryId": "co0", "note": "Luce", "date": "2024-01-01", "memberId": "1"}, {"id": "h1606", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2024-01-01", "memberId": "1"}, {"id": "h1607", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Internet", "date": "2024-01-01", "memberId": "1"}, {"id": "h1608", "type": "out", "amount": 132.0, "categoryId": "co2", "note": "Benzina", "date": "2024-01-01", "memberId": "1"}, {"id": "h1609", "type": "out", "amount": 209.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2024-01-01", "memberId": "1"}, {"id": "h1610", "type": "out", "amount": 119.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2024-01-01", "memberId": "1"}, {"id": "h1611", "type": "out", "amount": 106.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2024-01-01", "memberId": "1"}, {"id": "h1612", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2024-01-01", "memberId": "1"}, {"id": "h1613", "type": "out", "amount": 180.0, "categoryId": "co3", "note": "Psicologo", "date": "2024-01-01", "memberId": "1"}, {"id": "h1614", "type": "out", "amount": 66.0, "categoryId": "co4", "note": "Sigarette", "date": "2024-01-01", "memberId": "1"}, {"id": "h1615", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2024-01-01", "memberId": "1"}, {"id": "h1616", "type": "out", "amount": 60.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2024-01-01", "memberId": "1"}, {"id": "h1617", "type": "out", "amount": 180.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2024-01-01", "memberId": "1"}, {"id": "h1618", "type": "out", "amount": 12.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2024-01-01", "memberId": "1"}, {"id": "h1619", "type": "out", "amount": 19.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2024-01-01", "memberId": "1"}, {"id": "h1620", "type": "out", "amount": 42.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2024-01-01", "memberId": "1"}, {"id": "h1621", "type": "in", "amount": 1005.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2024-02-01", "memberId": "1"}, {"id": "h1622", "type": "in", "amount": 1115.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2024-02-01", "memberId": "1"}, {"id": "h1623", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2024-02-01", "memberId": "1"}, {"id": "h1624", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2024-02-01", "memberId": "1"}, {"id": "h1625", "type": "out", "amount": 132.0, "categoryId": "co0", "note": "Luce", "date": "2024-02-01", "memberId": "1"}, {"id": "h1626", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2024-02-01", "memberId": "1"}, {"id": "h1627", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Internet", "date": "2024-02-01", "memberId": "1"}, {"id": "h1628", "type": "out", "amount": 450.0, "categoryId": "co2", "note": "Assicurazione auto", "date": "2024-02-01", "memberId": "1"}, {"id": "h1629", "type": "out", "amount": 107.0, "categoryId": "co2", "note": "Benzina", "date": "2024-02-01", "memberId": "1"}, {"id": "h1630", "type": "out", "amount": 390.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2024-02-01", "memberId": "1"}, {"id": "h1631", "type": "out", "amount": 18.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2024-02-01", "memberId": "1"}, {"id": "h1632", "type": "out", "amount": 110.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2024-02-01", "memberId": "1"}, {"id": "h1633", "type": "out", "amount": 17.0, "categoryId": "co4", "note": "Libri/DVD", "date": "2024-02-01", "memberId": "1"}, {"id": "h1634", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2024-02-01", "memberId": "1"}, {"id": "h1635", "type": "out", "amount": 90.0, "categoryId": "co3", "note": "Psicologo", "date": "2024-02-01", "memberId": "1"}, {"id": "h1636", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Sigarette", "date": "2024-02-01", "memberId": "1"}, {"id": "h1637", "type": "out", "amount": 12.5, "categoryId": "co8", "note": "Altro figli (mance, regali)", "date": "2024-02-01", "memberId": "1"}, {"id": "h1638", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2024-02-01", "memberId": "1"}, {"id": "h1639", "type": "out", "amount": 120.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2024-02-01", "memberId": "1"}, {"id": "h1640", "type": "out", "amount": 56.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2024-02-01", "memberId": "1"}, {"id": "h1641", "type": "out", "amount": 20.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2024-02-01", "memberId": "1"}, {"id": "h1642", "type": "out", "amount": 33.0, "categoryId": "co3", "note": "Prodotti unghie,corpo/Fisioterapia/Massaggi", "date": "2024-02-01", "memberId": "1"}, {"id": "h1643", "type": "out", "amount": 142.0, "categoryId": "co10", "note": "Spese in viaggio", "date": "2024-02-01", "memberId": "1"}, {"id": "h1644", "type": "out", "amount": 20.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2024-02-01", "memberId": "1"}, {"id": "h1645", "type": "in", "amount": 832.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2024-03-01", "memberId": "1"}, {"id": "h1646", "type": "in", "amount": 782.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2024-03-01", "memberId": "1"}, {"id": "h1647", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2024-03-01", "memberId": "1"}, {"id": "h1648", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2024-03-01", "memberId": "1"}, {"id": "h1649", "type": "out", "amount": 55.0, "categoryId": "co0", "note": "Acqua", "date": "2024-03-01", "memberId": "1"}, {"id": "h1650", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2024-03-01", "memberId": "1"}, {"id": "h1651", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Internet", "date": "2024-03-01", "memberId": "1"}, {"id": "h1652", "type": "out", "amount": 138.0, "categoryId": "co2", "note": "Benzina", "date": "2024-03-01", "memberId": "1"}, {"id": "h1653", "type": "out", "amount": 299.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2024-03-01", "memberId": "1"}, {"id": "h1654", "type": "out", "amount": 22.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2024-03-01", "memberId": "1"}, {"id": "h1655", "type": "out", "amount": 16.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2024-03-01", "memberId": "1"}, {"id": "h1656", "type": "out", "amount": 89.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2024-03-01", "memberId": "1"}, {"id": "h1657", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2024-03-01", "memberId": "1"}, {"id": "h1658", "type": "out", "amount": 350.0, "categoryId": "co3", "note": "Psicologo", "date": "2024-03-01", "memberId": "1"}, {"id": "h1659", "type": "out", "amount": 53.0, "categoryId": "co4", "note": "Sigarette", "date": "2024-03-01", "memberId": "1"}, {"id": "h1660", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2024-03-01", "memberId": "1"}, {"id": "h1661", "type": "out", "amount": 70.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2024-03-01", "memberId": "1"}, {"id": "h1662", "type": "out", "amount": 23.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2024-03-01", "memberId": "1"}, {"id": "h1663", "type": "out", "amount": 107.0, "categoryId": "co3", "note": "Prodotti unghie/Fisioterapia/Massaggi/Abbigliamento", "date": "2024-03-01", "memberId": "1"}, {"id": "h1664", "type": "out", "amount": 21.0, "categoryId": "co10", "note": "Viaggio", "date": "2024-03-01", "memberId": "1"}, {"id": "h1665", "type": "out", "amount": 49.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2024-03-01", "memberId": "1"}, {"id": "h1666", "type": "out", "amount": 28.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2024-03-01", "memberId": "1"}, {"id": "h1667", "type": "in", "amount": 1850.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2024-04-01", "memberId": "1"}, {"id": "h1668", "type": "in", "amount": 857.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2024-04-01", "memberId": "1"}, {"id": "h1669", "type": "in", "amount": 40.0, "categoryId": "ci2", "note": "Affitti da case di proprietà", "date": "2024-04-01", "memberId": "1"}, {"id": "h1670", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2024-04-01", "memberId": "1"}, {"id": "h1671", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2024-04-01", "memberId": "1"}, {"id": "h1672", "type": "out", "amount": 211.0, "categoryId": "co0", "note": "Luce", "date": "2024-04-01", "memberId": "1"}, {"id": "h1673", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2024-04-01", "memberId": "1"}, {"id": "h1674", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Internet", "date": "2024-04-01", "memberId": "1"}, {"id": "h1675", "type": "out", "amount": 146.0, "categoryId": "co2", "note": "Benzina", "date": "2024-04-01", "memberId": "1"}, {"id": "h1676", "type": "out", "amount": 376.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2024-04-01", "memberId": "1"}, {"id": "h1677", "type": "out", "amount": 278.0, "categoryId": "co1", "note": "Generi alimentari /prodotti casa", "date": "2024-04-01", "memberId": "1"}, {"id": "h1678", "type": "out", "amount": 71.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2024-04-01", "memberId": "1"}, {"id": "h1679", "type": "out", "amount": 59.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2024-04-01", "memberId": "1"}, {"id": "h1680", "type": "out", "amount": 21.5, "categoryId": "co1", "note": "Caffè", "date": "2024-04-01", "memberId": "1"}, {"id": "h1681", "type": "out", "amount": 241.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2024-04-01", "memberId": "1"}, {"id": "h1682", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2024-04-01", "memberId": "1"}, {"id": "h1683", "type": "out", "amount": 155.0, "categoryId": "co3", "note": "Psicologo", "date": "2024-04-01", "memberId": "1"}, {"id": "h1684", "type": "out", "amount": 47.5, "categoryId": "co4", "note": "Sigarette", "date": "2024-04-01", "memberId": "1"}, {"id": "h1685", "type": "out", "amount": 72.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2024-04-01", "memberId": "1"}, {"id": "h1686", "type": "out", "amount": 70.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2024-04-01", "memberId": "1"}, {"id": "h1687", "type": "out", "amount": 275.0, "categoryId": "co3", "note": "Dentista/Oculista/Dermatologa", "date": "2024-04-01", "memberId": "1"}, {"id": "h1688", "type": "out", "amount": 17.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2024-04-01", "memberId": "1"}, {"id": "h1689", "type": "out", "amount": 158.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2024-04-01", "memberId": "1"}, {"id": "h1690", "type": "out", "amount": 117.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2024-04-01", "memberId": "1"}, {"id": "h1691", "type": "in", "amount": 1033.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2024-05-01", "memberId": "1"}, {"id": "h1692", "type": "in", "amount": 1108.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2024-05-01", "memberId": "1"}, {"id": "h1693", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2024-05-01", "memberId": "1"}, {"id": "h1694", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2024-05-01", "memberId": "1"}, {"id": "h1695", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Acqua", "date": "2024-05-01", "memberId": "1"}, {"id": "h1696", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2024-05-01", "memberId": "1"}, {"id": "h1697", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Internet", "date": "2024-05-01", "memberId": "1"}, {"id": "h1698", "type": "out", "amount": 395.0, "categoryId": "co2", "note": "Assicurazione auto", "date": "2024-05-01", "memberId": "1"}, {"id": "h1699", "type": "out", "amount": 77.0, "categoryId": "co2", "note": "Benzina", "date": "2024-05-01", "memberId": "1"}, {"id": "h1700", "type": "out", "amount": 165.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2024-05-01", "memberId": "1"}, {"id": "h1701", "type": "out", "amount": 138.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2024-05-01", "memberId": "1"}, {"id": "h1702", "type": "out", "amount": 47.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2024-05-01", "memberId": "1"}, {"id": "h1703", "type": "out", "amount": 25.0, "categoryId": "co1", "note": "Caffè", "date": "2024-05-01", "memberId": "1"}, {"id": "h1704", "type": "out", "amount": 93.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2024-05-01", "memberId": "1"}, {"id": "h1705", "type": "out", "amount": 20.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2024-05-01", "memberId": "1"}, {"id": "h1706", "type": "out", "amount": 110.0, "categoryId": "co3", "note": "Psicologo", "date": "2024-05-01", "memberId": "1"}, {"id": "h1707", "type": "out", "amount": 18.0, "categoryId": "co4", "note": "Sigarette", "date": "2024-05-01", "memberId": "1"}, {"id": "h1708", "type": "out", "amount": 10.0, "categoryId": "co9", "note": "Sport figli", "date": "2024-05-01", "memberId": "1"}, {"id": "h1709", "type": "out", "amount": 8.5, "categoryId": "co8", "note": "Altro figli (mance, regali)", "date": "2024-05-01", "memberId": "1"}, {"id": "h1710", "type": "out", "amount": 67.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2024-05-01", "memberId": "1"}, {"id": "h1711", "type": "out", "amount": 70.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2024-05-01", "memberId": "1"}, {"id": "h1712", "type": "out", "amount": 122.0, "categoryId": "co3", "note": "Dentista/Oculista/Dermatologa", "date": "2024-05-01", "memberId": "1"}, {"id": "h1713", "type": "out", "amount": 134.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2024-05-01", "memberId": "1"}, {"id": "h1714", "type": "out", "amount": 64.0, "categoryId": "co10", "note": "Hotel e pernottamento", "date": "2024-05-01", "memberId": "1"}, {"id": "h1715", "type": "out", "amount": 65.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2024-05-01", "memberId": "1"}, {"id": "h1716", "type": "in", "amount": 200.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2024-06-01", "memberId": "1"}, {"id": "h1717", "type": "in", "amount": 865.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2024-06-01", "memberId": "1"}, {"id": "h1718", "type": "in", "amount": 839.0, "categoryId": "ci2", "note": "Affitti da case di proprietà", "date": "2024-06-01", "memberId": "1"}, {"id": "h1719", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2024-06-01", "memberId": "1"}, {"id": "h1720", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2024-06-01", "memberId": "1"}, {"id": "h1721", "type": "out", "amount": 118.0, "categoryId": "co0", "note": "Luce", "date": "2024-06-01", "memberId": "1"}, {"id": "h1722", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2024-06-01", "memberId": "1"}, {"id": "h1723", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Internet", "date": "2024-06-01", "memberId": "1"}, {"id": "h1724", "type": "out", "amount": 130.0, "categoryId": "co2", "note": "Benzina", "date": "2024-06-01", "memberId": "1"}, {"id": "h1725", "type": "out", "amount": 78.3, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2024-06-01", "memberId": "1"}, {"id": "h1726", "type": "out", "amount": 390.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2024-06-01", "memberId": "1"}, {"id": "h1727", "type": "out", "amount": 161.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2024-06-01", "memberId": "1"}, {"id": "h1728", "type": "out", "amount": 120.5, "categoryId": "co5", "note": "Abbigliamento", "date": "2024-06-01", "memberId": "1"}, {"id": "h1729", "type": "out", "amount": 22.0, "categoryId": "co1", "note": "Caffè", "date": "2024-06-01", "memberId": "1"}, {"id": "h1730", "type": "out", "amount": 136.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2024-06-01", "memberId": "1"}, {"id": "h1731", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2024-06-01", "memberId": "1"}, {"id": "h1732", "type": "out", "amount": 90.0, "categoryId": "co3", "note": "Psicologo", "date": "2024-06-01", "memberId": "1"}, {"id": "h1733", "type": "out", "amount": 60.0, "categoryId": "co4", "note": "Sigarette", "date": "2024-06-01", "memberId": "1"}, {"id": "h1734", "type": "out", "amount": 50.0, "categoryId": "co8", "note": "Regali", "date": "2024-06-01", "memberId": "1"}, {"id": "h1735", "type": "out", "amount": 62.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2024-06-01", "memberId": "1"}, {"id": "h1736", "type": "out", "amount": 128.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2024-06-01", "memberId": "1"}, {"id": "h1737", "type": "out", "amount": 100.0, "categoryId": "co3", "note": "Dentista/Oculista/Dermatologa", "date": "2024-06-01", "memberId": "1"}, {"id": "h1738", "type": "out", "amount": 43.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2024-06-01", "memberId": "1"}, {"id": "h1739", "type": "out", "amount": 30.0, "categoryId": "co10", "note": "Viaggio", "date": "2024-06-01", "memberId": "1"}, {"id": "h1740", "type": "out", "amount": 26.0, "categoryId": "co10", "note": "Spese in viaggio", "date": "2024-06-01", "memberId": "1"}, {"id": "h1741", "type": "out", "amount": 171.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2024-06-01", "memberId": "1"}, {"id": "h1742", "type": "out", "amount": 83.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2024-06-01", "memberId": "1"}, {"id": "h1743", "type": "in", "amount": 926.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2024-07-01", "memberId": "1"}, {"id": "h1744", "type": "in", "amount": 797.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2024-07-01", "memberId": "1"}, {"id": "h1745", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2024-07-01", "memberId": "1"}, {"id": "h1746", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2024-07-01", "memberId": "1"}, {"id": "h1747", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2024-07-01", "memberId": "1"}, {"id": "h1748", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Internet", "date": "2024-07-01", "memberId": "1"}, {"id": "h1749", "type": "out", "amount": 231.0, "categoryId": "co2", "note": "Benzina", "date": "2024-07-01", "memberId": "1"}, {"id": "h1750", "type": "out", "amount": 44.0, "categoryId": "co2", "note": "Parcheggi", "date": "2024-07-01", "memberId": "1"}, {"id": "h1751", "type": "out", "amount": 423.0, "categoryId": "co1", "note": "Generi alimentari /spesa casa", "date": "2024-07-01", "memberId": "1"}, {"id": "h1752", "type": "out", "amount": 130.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2024-07-01", "memberId": "1"}, {"id": "h1753", "type": "out", "amount": 120.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2024-07-01", "memberId": "1"}, {"id": "h1754", "type": "out", "amount": 22.5, "categoryId": "co1", "note": "Caffè", "date": "2024-07-01", "memberId": "1"}, {"id": "h1755", "type": "out", "amount": 500.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2024-07-01", "memberId": "1"}, {"id": "h1756", "type": "out", "amount": 43.6, "categoryId": "co4", "note": "Cinema/Concerti/Teatro", "date": "2024-07-01", "memberId": "1"}, {"id": "h1757", "type": "out", "amount": 39.0, "categoryId": "co4", "note": "Libri/DVD", "date": "2024-07-01", "memberId": "1"}, {"id": "h1758", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2024-07-01", "memberId": "1"}, {"id": "h1759", "type": "out", "amount": 163.0, "categoryId": "co3", "note": "Psicologo", "date": "2024-07-01", "memberId": "1"}, {"id": "h1760", "type": "out", "amount": 49.0, "categoryId": "co4", "note": "Sigarette", "date": "2024-07-01", "memberId": "1"}, {"id": "h1761", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2024-07-01", "memberId": "1"}, {"id": "h1762", "type": "out", "amount": 26.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2024-07-01", "memberId": "1"}, {"id": "h1763", "type": "out", "amount": 182.0, "categoryId": "co3", "note": "Dentista/Oculista/Dermatologa", "date": "2024-07-01", "memberId": "1"}, {"id": "h1764", "type": "out", "amount": 25.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2024-07-01", "memberId": "1"}, {"id": "h1765", "type": "out", "amount": 13.0, "categoryId": "co3", "note": "Prodotti unghie/Fisioterapia/Massaggi", "date": "2024-07-01", "memberId": "1"}, {"id": "h1766", "type": "out", "amount": 113.0, "categoryId": "co10", "note": "Viaggio", "date": "2024-07-01", "memberId": "1"}, {"id": "h1767", "type": "out", "amount": 267.0, "categoryId": "co10", "note": "Hotel e pernottamento", "date": "2024-07-01", "memberId": "1"}, {"id": "h1768", "type": "out", "amount": 58.0, "categoryId": "co10", "note": "Spese in viaggio", "date": "2024-07-01", "memberId": "1"}, {"id": "h1769", "type": "out", "amount": 170.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2024-07-01", "memberId": "1"}, {"id": "h1770", "type": "out", "amount": 48.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2024-07-01", "memberId": "1"}, {"id": "h1771", "type": "in", "amount": 972.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2024-08-01", "memberId": "1"}, {"id": "h1772", "type": "in", "amount": 3018.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2024-08-01", "memberId": "1"}, {"id": "h1773", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2024-08-01", "memberId": "1"}, {"id": "h1774", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2024-08-01", "memberId": "1"}, {"id": "h1775", "type": "out", "amount": 197.0, "categoryId": "co0", "note": "Luce", "date": "2024-08-01", "memberId": "1"}, {"id": "h1776", "type": "out", "amount": 675.0, "categoryId": "co0", "note": "Condominio", "date": "2024-08-01", "memberId": "1"}, {"id": "h1777", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2024-08-01", "memberId": "1"}, {"id": "h1778", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Internet", "date": "2024-08-01", "memberId": "1"}, {"id": "h1779", "type": "out", "amount": 106.0, "categoryId": "co2", "note": "Benzina", "date": "2024-08-01", "memberId": "1"}, {"id": "h1780", "type": "out", "amount": 290.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2024-08-01", "memberId": "1"}, {"id": "h1781", "type": "out", "amount": 242.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2024-08-01", "memberId": "1"}, {"id": "h1782", "type": "out", "amount": 59.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2024-08-01", "memberId": "1"}, {"id": "h1783", "type": "out", "amount": 89.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2024-08-01", "memberId": "1"}, {"id": "h1784", "type": "out", "amount": 445.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2024-08-01", "memberId": "1"}, {"id": "h1785", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2024-08-01", "memberId": "1"}, {"id": "h1786", "type": "out", "amount": 163.0, "categoryId": "co3", "note": "Psicologo", "date": "2024-08-01", "memberId": "1"}, {"id": "h1787", "type": "out", "amount": 32.5, "categoryId": "co4", "note": "Sigarette", "date": "2024-08-01", "memberId": "1"}, {"id": "h1788", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2024-08-01", "memberId": "1"}, {"id": "h1789", "type": "out", "amount": 180.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2024-08-01", "memberId": "1"}, {"id": "h1790", "type": "out", "amount": 161.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2024-08-01", "memberId": "1"}, {"id": "h1791", "type": "out", "amount": 21.5, "categoryId": "co3", "note": "Prodotti unghie/Fisioterapia/Massaggi", "date": "2024-08-01", "memberId": "1"}, {"id": "h1792", "type": "out", "amount": 306.0, "categoryId": "co10", "note": "Viaggio", "date": "2024-08-01", "memberId": "1"}, {"id": "h1793", "type": "out", "amount": 234.0, "categoryId": "co10", "note": "Hotel e pernottamento", "date": "2024-08-01", "memberId": "1"}, {"id": "h1794", "type": "out", "amount": 57.5, "categoryId": "co10", "note": "Spese in viaggio", "date": "2024-08-01", "memberId": "1"}, {"id": "h1795", "type": "out", "amount": 30.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2024-08-01", "memberId": "1"}, {"id": "h1796", "type": "in", "amount": 1049.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2024-09-01", "memberId": "1"}, {"id": "h1797", "type": "in", "amount": 876.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2024-09-01", "memberId": "1"}, {"id": "h1798", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2024-09-01", "memberId": "1"}, {"id": "h1799", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2024-09-01", "memberId": "1"}, {"id": "h1800", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2024-09-01", "memberId": "1"}, {"id": "h1801", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Internet", "date": "2024-09-01", "memberId": "1"}, {"id": "h1802", "type": "out", "amount": 94.0, "categoryId": "co2", "note": "Benzina", "date": "2024-09-01", "memberId": "1"}, {"id": "h1803", "type": "out", "amount": 114.47, "categoryId": "co2", "note": "Bollo auto", "date": "2024-09-01", "memberId": "1"}, {"id": "h1804", "type": "out", "amount": 208.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2024-09-01", "memberId": "1"}, {"id": "h1805", "type": "out", "amount": 227.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2024-09-01", "memberId": "1"}, {"id": "h1806", "type": "out", "amount": 18.0, "categoryId": "co1", "note": "Caffè", "date": "2024-09-01", "memberId": "1"}, {"id": "h1807", "type": "out", "amount": 531.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2024-09-01", "memberId": "1"}, {"id": "h1808", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2024-09-01", "memberId": "1"}, {"id": "h1809", "type": "out", "amount": 229.0, "categoryId": "co3", "note": "Psicologo", "date": "2024-09-01", "memberId": "1"}, {"id": "h1810", "type": "out", "amount": 86.0, "categoryId": "co4", "note": "Sigarette", "date": "2024-09-01", "memberId": "1"}, {"id": "h1811", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2024-09-01", "memberId": "1"}, {"id": "h1812", "type": "out", "amount": 129.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2024-09-01", "memberId": "1"}, {"id": "h1813", "type": "out", "amount": 80.0, "categoryId": "co3", "note": "Dentista/Oculista/Dermatologa", "date": "2024-09-01", "memberId": "1"}, {"id": "h1814", "type": "out", "amount": 25.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2024-09-01", "memberId": "1"}, {"id": "h1815", "type": "out", "amount": 25.0, "categoryId": "co3", "note": "Prodotti unghie,corpo/Fisioterapia/", "date": "2024-09-01", "memberId": "1"}, {"id": "h1816", "type": "out", "amount": 30.0, "categoryId": "co10", "note": "Viaggio", "date": "2024-09-01", "memberId": "1"}, {"id": "h1817", "type": "out", "amount": 2300.0, "categoryId": "co6", "note": "Istruzione e formazione personale", "date": "2024-09-01", "memberId": "1"}, {"id": "h1818", "type": "out", "amount": 39.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2024-09-01", "memberId": "1"}, {"id": "h1819", "type": "in", "amount": 1370.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2024-10-01", "memberId": "1"}, {"id": "h1820", "type": "in", "amount": 827.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2024-10-01", "memberId": "1"}, {"id": "h1821", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2024-10-01", "memberId": "1"}, {"id": "h1822", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2024-10-01", "memberId": "1"}, {"id": "h1823", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2024-10-01", "memberId": "1"}, {"id": "h1824", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Internet", "date": "2024-10-01", "memberId": "1"}, {"id": "h1825", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Manutenzione/Riparazioni", "date": "2024-10-01", "memberId": "1"}, {"id": "h1826", "type": "out", "amount": 85.0, "categoryId": "co2", "note": "Benzina", "date": "2024-10-01", "memberId": "1"}, {"id": "h1827", "type": "out", "amount": 230.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2024-10-01", "memberId": "1"}, {"id": "h1828", "type": "out", "amount": 279.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2024-10-01", "memberId": "1"}, {"id": "h1829", "type": "out", "amount": 218.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2024-10-01", "memberId": "1"}, {"id": "h1830", "type": "out", "amount": 84.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2024-10-01", "memberId": "1"}, {"id": "h1831", "type": "out", "amount": 41.0, "categoryId": "co1", "note": "Caffè /Lavastoviglie", "date": "2024-10-01", "memberId": "1"}, {"id": "h1832", "type": "out", "amount": 200.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2024-10-01", "memberId": "1"}, {"id": "h1833", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2024-10-01", "memberId": "1"}, {"id": "h1834", "type": "out", "amount": 98.0, "categoryId": "co3", "note": "Psicologo", "date": "2024-10-01", "memberId": "1"}, {"id": "h1835", "type": "out", "amount": 20.0, "categoryId": "co4", "note": "Sigarette", "date": "2024-10-01", "memberId": "1"}, {"id": "h1836", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2024-10-01", "memberId": "1"}, {"id": "h1837", "type": "out", "amount": 20.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2024-10-01", "memberId": "1"}, {"id": "h1838", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2024-10-01", "memberId": "1"}, {"id": "h1839", "type": "out", "amount": 9.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2024-10-01", "memberId": "1"}, {"id": "h1840", "type": "out", "amount": 6.0, "categoryId": "co3", "note": "Prodotti unghie/Fisioterapia/Massaggi", "date": "2024-10-01", "memberId": "1"}, {"id": "h1841", "type": "out", "amount": 153.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2024-10-01", "memberId": "1"}, {"id": "h1842", "type": "out", "amount": 10.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2024-10-01", "memberId": "1"}, {"id": "h1843", "type": "in", "amount": 570.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2024-11-01", "memberId": "1"}, {"id": "h1844", "type": "in", "amount": 972.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2024-11-01", "memberId": "1"}, {"id": "h1845", "type": "in", "amount": 983.0, "categoryId": "ci2", "note": "Affitti da case di proprietà", "date": "2024-11-01", "memberId": "1"}, {"id": "h1846", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2024-11-01", "memberId": "1"}, {"id": "h1847", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2024-11-01", "memberId": "1"}, {"id": "h1848", "type": "out", "amount": 179.0, "categoryId": "co0", "note": "Luce", "date": "2024-11-01", "memberId": "1"}, {"id": "h1849", "type": "out", "amount": 94.0, "categoryId": "co0", "note": "Spazzatura", "date": "2024-11-01", "memberId": "1"}, {"id": "h1850", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2024-11-01", "memberId": "1"}, {"id": "h1851", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Internet", "date": "2024-11-01", "memberId": "1"}, {"id": "h1852", "type": "out", "amount": 395.0, "categoryId": "co0", "note": "Contributi", "date": "2024-11-01", "memberId": "1"}, {"id": "h1853", "type": "out", "amount": 245.0, "categoryId": "co2", "note": "Assicurazione auto", "date": "2024-11-01", "memberId": "1"}, {"id": "h1854", "type": "out", "amount": 22.0, "categoryId": "co2", "note": "Benzina", "date": "2024-11-01", "memberId": "1"}, {"id": "h1855", "type": "out", "amount": 320.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2024-11-01", "memberId": "1"}, {"id": "h1856", "type": "out", "amount": 189.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2024-11-01", "memberId": "1"}, {"id": "h1857", "type": "out", "amount": 30.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2024-11-01", "memberId": "1"}, {"id": "h1858", "type": "out", "amount": 21.0, "categoryId": "co1", "note": "Caffè", "date": "2024-11-01", "memberId": "1"}, {"id": "h1859", "type": "out", "amount": 68.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2024-11-01", "memberId": "1"}, {"id": "h1860", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2024-11-01", "memberId": "1"}, {"id": "h1861", "type": "out", "amount": 163.0, "categoryId": "co3", "note": "Psicologo", "date": "2024-11-01", "memberId": "1"}, {"id": "h1862", "type": "out", "amount": 53.0, "categoryId": "co4", "note": "Sigarette", "date": "2024-11-01", "memberId": "1"}, {"id": "h1863", "type": "out", "amount": 15.0, "categoryId": "co8", "note": "Regali", "date": "2024-11-01", "memberId": "1"}, {"id": "h1864", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2024-11-01", "memberId": "1"}, {"id": "h1865", "type": "out", "amount": 10.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2024-11-01", "memberId": "1"}, {"id": "h1866", "type": "out", "amount": 182.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2024-11-01", "memberId": "1"}, {"id": "h1867", "type": "out", "amount": 631.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2024-11-01", "memberId": "1"}, {"id": "h1868", "type": "out", "amount": 44.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2024-11-01", "memberId": "1"}, {"id": "h1869", "type": "in", "amount": 1452.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2024-12-01", "memberId": "1"}, {"id": "h1870", "type": "in", "amount": 1589.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2024-12-01", "memberId": "1"}, {"id": "h1871", "type": "in", "amount": 40.0, "categoryId": "ci2", "note": "Affitti da case di proprietà", "date": "2024-12-01", "memberId": "1"}, {"id": "h1872", "type": "in", "amount": 100.0, "categoryId": "ci3", "note": "Dividendi da azioni", "date": "2024-12-01", "memberId": "1"}, {"id": "h1873", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2024-12-01", "memberId": "1"}, {"id": "h1874", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2024-12-01", "memberId": "1"}, {"id": "h1875", "type": "out", "amount": 36.0, "categoryId": "co0", "note": "Acqua", "date": "2024-12-01", "memberId": "1"}, {"id": "h1876", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2024-12-01", "memberId": "1"}, {"id": "h1877", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Internet", "date": "2024-12-01", "memberId": "1"}, {"id": "h1878", "type": "out", "amount": 136.0, "categoryId": "co2", "note": "Benzina", "date": "2024-12-01", "memberId": "1"}, {"id": "h1879", "type": "out", "amount": 20.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2024-12-01", "memberId": "1"}, {"id": "h1880", "type": "out", "amount": 234.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2024-12-01", "memberId": "1"}, {"id": "h1881", "type": "out", "amount": 293.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2024-12-01", "memberId": "1"}, {"id": "h1882", "type": "out", "amount": 6.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2024-12-01", "memberId": "1"}, {"id": "h1883", "type": "out", "amount": 18.0, "categoryId": "co1", "note": "Caffè", "date": "2024-12-01", "memberId": "1"}, {"id": "h1884", "type": "out", "amount": 271.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2024-12-01", "memberId": "1"}, {"id": "h1885", "type": "out", "amount": 12.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2024-12-01", "memberId": "1"}, {"id": "h1886", "type": "out", "amount": 49.0, "categoryId": "co3", "note": "Psicologo", "date": "2024-12-01", "memberId": "1"}, {"id": "h1887", "type": "out", "amount": 50.0, "categoryId": "co4", "note": "Sigarette", "date": "2024-12-01", "memberId": "1"}, {"id": "h1888", "type": "out", "amount": 50.0, "categoryId": "co8", "note": "Regali", "date": "2024-12-01", "memberId": "1"}, {"id": "h1889", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2024-12-01", "memberId": "1"}, {"id": "h1890", "type": "out", "amount": 30.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2024-12-01", "memberId": "1"}, {"id": "h1891", "type": "out", "amount": 145.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2024-12-01", "memberId": "1"}, {"id": "h1892", "type": "out", "amount": 42.0, "categoryId": "co10", "note": "Hotel e pernottamento", "date": "2024-12-01", "memberId": "1"}, {"id": "h1893", "type": "out", "amount": 40.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2024-12-01", "memberId": "1"}, {"id": "h1894", "type": "out", "amount": 54.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2024-12-01", "memberId": "1"}, {"id": "h1895", "type": "in", "amount": 1310.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2025-01-01", "memberId": "1"}, {"id": "h1896", "type": "in", "amount": 900.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2025-01-01", "memberId": "1"}, {"id": "h1897", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2025-01-01", "memberId": "1"}, {"id": "h1898", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2025-01-01", "memberId": "1"}, {"id": "h1899", "type": "out", "amount": 216.0, "categoryId": "co0", "note": "Luce", "date": "2025-01-01", "memberId": "1"}, {"id": "h1900", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2025-01-01", "memberId": "1"}, {"id": "h1901", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Internet", "date": "2025-01-01", "memberId": "1"}, {"id": "h1902", "type": "out", "amount": 130.0, "categoryId": "co2", "note": "Benzina", "date": "2025-01-01", "memberId": "1"}, {"id": "h1903", "type": "out", "amount": 4.0, "categoryId": "co2", "note": "Mezzi pubblici e taxi", "date": "2025-01-01", "memberId": "1"}, {"id": "h1904", "type": "out", "amount": 174.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2025-01-01", "memberId": "1"}, {"id": "h1905", "type": "out", "amount": 208.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2025-01-01", "memberId": "1"}, {"id": "h1906", "type": "out", "amount": 20.0, "categoryId": "co1", "note": "Caffè", "date": "2025-01-01", "memberId": "1"}, {"id": "h1907", "type": "out", "amount": 283.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2025-01-01", "memberId": "1"}, {"id": "h1908", "type": "out", "amount": 20.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2025-01-01", "memberId": "1"}, {"id": "h1909", "type": "out", "amount": 108.0, "categoryId": "co3", "note": "Psicologo", "date": "2025-01-01", "memberId": "1"}, {"id": "h1910", "type": "out", "amount": 83.0, "categoryId": "co4", "note": "Sigarette", "date": "2025-01-01", "memberId": "1"}, {"id": "h1911", "type": "out", "amount": 35.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2025-01-01", "memberId": "1"}, {"id": "h1912", "type": "out", "amount": 286.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2025-01-01", "memberId": "1"}, {"id": "h1913", "type": "out", "amount": 50.0, "categoryId": "co3", "note": "Dentista/Oculista/Dermatologa", "date": "2025-01-01", "memberId": "1"}, {"id": "h1914", "type": "out", "amount": 22.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2025-01-01", "memberId": "1"}, {"id": "h1915", "type": "out", "amount": 12.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2025-01-01", "memberId": "1"}, {"id": "h1916", "type": "out", "amount": 5.0, "categoryId": "co3", "note": "Prodotti unghie/Fisioterapia/Massaggi", "date": "2025-01-01", "memberId": "1"}, {"id": "h1917", "type": "out", "amount": 100.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2025-01-01", "memberId": "1"}, {"id": "h1918", "type": "in", "amount": 862.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2025-02-01", "memberId": "1"}, {"id": "h1919", "type": "in", "amount": 1262.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2025-02-01", "memberId": "1"}, {"id": "h1920", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2025-02-01", "memberId": "1"}, {"id": "h1921", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2025-02-01", "memberId": "1"}, {"id": "h1922", "type": "out", "amount": 308.0, "categoryId": "co0", "note": "Luce", "date": "2025-02-01", "memberId": "1"}, {"id": "h1923", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2025-02-01", "memberId": "1"}, {"id": "h1924", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Internet", "date": "2025-02-01", "memberId": "1"}, {"id": "h1925", "type": "out", "amount": 320.0, "categoryId": "co2", "note": "Assicurazione auto", "date": "2025-02-01", "memberId": "1"}, {"id": "h1926", "type": "out", "amount": 75.0, "categoryId": "co2", "note": "Benzina", "date": "2025-02-01", "memberId": "1"}, {"id": "h1927", "type": "out", "amount": 177.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2025-02-01", "memberId": "1"}, {"id": "h1928", "type": "out", "amount": 148.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2025-02-01", "memberId": "1"}, {"id": "h1929", "type": "out", "amount": 20.0, "categoryId": "co1", "note": "Caffè", "date": "2025-02-01", "memberId": "1"}, {"id": "h1930", "type": "out", "amount": 243.5, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2025-02-01", "memberId": "1"}, {"id": "h1931", "type": "out", "amount": 20.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2025-02-01", "memberId": "1"}, {"id": "h1932", "type": "out", "amount": 49.0, "categoryId": "co3", "note": "Psicologo", "date": "2025-02-01", "memberId": "1"}, {"id": "h1933", "type": "out", "amount": 73.0, "categoryId": "co4", "note": "Sigarette", "date": "2025-02-01", "memberId": "1"}, {"id": "h1934", "type": "out", "amount": 35.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2025-02-01", "memberId": "1"}, {"id": "h1935", "type": "out", "amount": 82.0, "categoryId": "co3", "note": "Dentista/Oculista/Dermatologa", "date": "2025-02-01", "memberId": "1"}, {"id": "h1936", "type": "out", "amount": 59.0, "categoryId": "co3", "note": "Psicologo", "date": "2025-02-01", "memberId": "1"}, {"id": "h1937", "type": "in", "amount": 859.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2025-03-01", "memberId": "1"}, {"id": "h1938", "type": "in", "amount": 1107.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2025-03-01", "memberId": "1"}, {"id": "h1939", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2025-03-01", "memberId": "1"}, {"id": "h1940", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2025-03-01", "memberId": "1"}, {"id": "h1941", "type": "out", "amount": 111.0, "categoryId": "co0", "note": "Acqua", "date": "2025-03-01", "memberId": "1"}, {"id": "h1942", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2025-03-01", "memberId": "1"}, {"id": "h1943", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Internet", "date": "2025-03-01", "memberId": "1"}, {"id": "h1944", "type": "out", "amount": 115.0, "categoryId": "co2", "note": "Benzina", "date": "2025-03-01", "memberId": "1"}, {"id": "h1945", "type": "out", "amount": 1280.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2025-03-01", "memberId": "1"}, {"id": "h1946", "type": "out", "amount": 143.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2025-03-01", "memberId": "1"}, {"id": "h1947", "type": "out", "amount": 130.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2025-03-01", "memberId": "1"}, {"id": "h1948", "type": "out", "amount": 30.0, "categoryId": "co1", "note": "Caffè", "date": "2025-03-01", "memberId": "1"}, {"id": "h1949", "type": "out", "amount": 149.5, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2025-03-01", "memberId": "1"}, {"id": "h1950", "type": "out", "amount": 20.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2025-03-01", "memberId": "1"}, {"id": "h1951", "type": "out", "amount": 59.0, "categoryId": "co3", "note": "Psicologo", "date": "2025-03-01", "memberId": "1"}, {"id": "h1952", "type": "out", "amount": 128.0, "categoryId": "co4", "note": "Sigarette", "date": "2025-03-01", "memberId": "1"}, {"id": "h1953", "type": "out", "amount": 35.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2025-03-01", "memberId": "1"}, {"id": "h1954", "type": "out", "amount": 20.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2025-03-01", "memberId": "1"}, {"id": "h1955", "type": "out", "amount": 47.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2025-03-01", "memberId": "1"}, {"id": "h1956", "type": "out", "amount": 15.0, "categoryId": "co3", "note": "Prodotti unghie/Fisioterapia/Massaggi", "date": "2025-03-01", "memberId": "1"}, {"id": "h1957", "type": "out", "amount": 49.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2025-03-01", "memberId": "1"}, {"id": "h1958", "type": "in", "amount": 884.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2025-04-01", "memberId": "1"}, {"id": "h1959", "type": "in", "amount": 1402.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2025-04-01", "memberId": "1"}, {"id": "h1960", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2025-04-01", "memberId": "1"}, {"id": "h1961", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2025-04-01", "memberId": "1"}, {"id": "h1962", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2025-04-01", "memberId": "1"}, {"id": "h1963", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Internet", "date": "2025-04-01", "memberId": "1"}, {"id": "h1964", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Manutenzione/Riparazioni", "date": "2025-04-01", "memberId": "1"}, {"id": "h1965", "type": "out", "amount": 153.0, "categoryId": "co2", "note": "Verbale", "date": "2025-04-01", "memberId": "1"}, {"id": "h1966", "type": "out", "amount": 81.0, "categoryId": "co2", "note": "Benzina", "date": "2025-04-01", "memberId": "1"}, {"id": "h1967", "type": "out", "amount": 80.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2025-04-01", "memberId": "1"}, {"id": "h1968", "type": "out", "amount": 341.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2025-04-01", "memberId": "1"}, {"id": "h1969", "type": "out", "amount": 135.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2025-04-01", "memberId": "1"}, {"id": "h1970", "type": "out", "amount": 134.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2025-04-01", "memberId": "1"}, {"id": "h1971", "type": "out", "amount": 20.0, "categoryId": "co1", "note": "Caffè", "date": "2025-04-01", "memberId": "1"}, {"id": "h1972", "type": "out", "amount": 112.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2025-04-01", "memberId": "1"}, {"id": "h1973", "type": "out", "amount": 320.0, "categoryId": "co4", "note": "Cellulare", "date": "2025-04-01", "memberId": "1"}, {"id": "h1974", "type": "out", "amount": 20.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2025-04-01", "memberId": "1"}, {"id": "h1975", "type": "out", "amount": 49.0, "categoryId": "co3", "note": "Psicologo", "date": "2025-04-01", "memberId": "1"}, {"id": "h1976", "type": "out", "amount": 89.0, "categoryId": "co4", "note": "Sigarette", "date": "2025-04-01", "memberId": "1"}, {"id": "h1977", "type": "out", "amount": 35.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2025-04-01", "memberId": "1"}, {"id": "h1978", "type": "out", "amount": 45.0, "categoryId": "co9", "note": "Abbonamento palestra - sport-meditopia", "date": "2025-04-01", "memberId": "1"}, {"id": "h1979", "type": "out", "amount": 228.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2025-04-01", "memberId": "1"}, {"id": "h1980", "type": "out", "amount": 71.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2025-04-01", "memberId": "1"}, {"id": "h1981", "type": "in", "amount": 864.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2025-05-01", "memberId": "1"}, {"id": "h1982", "type": "in", "amount": 200.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2025-05-01", "memberId": "1"}, {"id": "h1983", "type": "in", "amount": 1372.0, "categoryId": "ci2", "note": "Affitti da case di proprietà", "date": "2025-05-01", "memberId": "1"}, {"id": "h1985", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2025-05-01", "memberId": "1"}, {"id": "h1986", "type": "out", "amount": 249.0, "categoryId": "co0", "note": "Luce", "date": "2025-05-01", "memberId": "1"}, {"id": "h1987", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2025-05-01", "memberId": "1"}, {"id": "h1988", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Internet", "date": "2025-05-01", "memberId": "1"}, {"id": "h1989", "type": "out", "amount": 590.0, "categoryId": "co0", "note": "Altro casa/giardino", "date": "2025-05-01", "memberId": "1"}, {"id": "h1990", "type": "out", "amount": 99.0, "categoryId": "co2", "note": "Benzina", "date": "2025-05-01", "memberId": "1"}, {"id": "h1991", "type": "out", "amount": 64.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2025-05-01", "memberId": "1"}, {"id": "h1992", "type": "out", "amount": 150.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2025-05-01", "memberId": "1"}, {"id": "h1993", "type": "out", "amount": 357.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2025-05-01", "memberId": "1"}, {"id": "h1994", "type": "out", "amount": 20.0, "categoryId": "co1", "note": "Caffè", "date": "2025-05-01", "memberId": "1"}, {"id": "h1995", "type": "out", "amount": 299.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2025-05-01", "memberId": "1"}, {"id": "h1996", "type": "out", "amount": 45.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon/OpenAI", "date": "2025-05-01", "memberId": "1"}, {"id": "h1997", "type": "out", "amount": 49.0, "categoryId": "co3", "note": "Psicologo", "date": "2025-05-01", "memberId": "1"}, {"id": "h1998", "type": "out", "amount": 115.0, "categoryId": "co4", "note": "Sigarette", "date": "2025-05-01", "memberId": "1"}, {"id": "h1999", "type": "out", "amount": 35.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2025-05-01", "memberId": "1"}, {"id": "h2000", "type": "out", "amount": 75.0, "categoryId": "co3", "note": "Dentista/Oculista/Dermatologa", "date": "2025-05-01", "memberId": "1"}, {"id": "h2001", "type": "out", "amount": 27.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2025-05-01", "memberId": "1"}, {"id": "h2002", "type": "out", "amount": 84.0, "categoryId": "co3", "note": "Prodotti unghie/Fisioterapia/Massaggi", "date": "2025-05-01", "memberId": "1"}, {"id": "h2003", "type": "out", "amount": 164.0, "categoryId": "co10", "note": "Viaggio", "date": "2025-05-01", "memberId": "1"}, {"id": "h2004", "type": "out", "amount": 13.0, "categoryId": "co6", "note": "Istruzione e formazione personale", "date": "2025-05-01", "memberId": "1"}, {"id": "h2005", "type": "in", "amount": 882.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2025-06-01", "memberId": "1"}, {"id": "h2006", "type": "in", "amount": 1600.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2025-06-01", "memberId": "1"}, {"id": "h2008", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2025-06-01", "memberId": "1"}, {"id": "h2009", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2025-06-01", "memberId": "1"}, {"id": "h2010", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2025-06-01", "memberId": "1"}, {"id": "h2011", "type": "out", "amount": 50.0, "categoryId": "co0", "note": "Internet", "date": "2025-06-01", "memberId": "1"}, {"id": "h2012", "type": "out", "amount": 50.0, "categoryId": "co0", "note": "Arredamento ed elettrodomestici", "date": "2025-06-01", "memberId": "1"}, {"id": "h2013", "type": "out", "amount": 60.0, "categoryId": "co2", "note": "Benzina", "date": "2025-06-01", "memberId": "1"}, {"id": "h2014", "type": "out", "amount": 38.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2025-06-01", "memberId": "1"}, {"id": "h2015", "type": "out", "amount": 212.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2025-06-01", "memberId": "1"}, {"id": "h2016", "type": "out", "amount": 245.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2025-06-01", "memberId": "1"}, {"id": "h2017", "type": "out", "amount": 95.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2025-06-01", "memberId": "1"}, {"id": "h2018", "type": "out", "amount": 20.0, "categoryId": "co1", "note": "Caffè", "date": "2025-06-01", "memberId": "1"}, {"id": "h2019", "type": "out", "amount": 449.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2025-06-01", "memberId": "1"}, {"id": "h2020", "type": "out", "amount": 20.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2025-06-01", "memberId": "1"}, {"id": "h2021", "type": "out", "amount": 49.0, "categoryId": "co3", "note": "Psicologo", "date": "2025-06-01", "memberId": "1"}, {"id": "h2022", "type": "out", "amount": 112.0, "categoryId": "co4", "note": "Sigarette", "date": "2025-06-01", "memberId": "1"}, {"id": "h2023", "type": "out", "amount": 35.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2025-06-01", "memberId": "1"}, {"id": "h2024", "type": "out", "amount": 94.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2025-06-01", "memberId": "1"}, {"id": "h2025", "type": "out", "amount": 80.0, "categoryId": "co10", "note": "Viaggio", "date": "2025-06-01", "memberId": "1"}, {"id": "h2026", "type": "out", "amount": 200.0, "categoryId": "co10", "note": "Hotel e pernottamento", "date": "2025-06-01", "memberId": "1"}, {"id": "h2027", "type": "out", "amount": 63.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2025-06-01", "memberId": "1"}, {"id": "h2028", "type": "in", "amount": 1494.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2025-07-01", "memberId": "1"}, {"id": "h2029", "type": "in", "amount": 874.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2025-07-01", "memberId": "1"}, {"id": "h2031", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2025-07-01", "memberId": "1"}, {"id": "h2032", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2025-07-01", "memberId": "1"}, {"id": "h2033", "type": "out", "amount": 147.0, "categoryId": "co0", "note": "Luce", "date": "2025-07-01", "memberId": "1"}, {"id": "h2034", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2025-07-01", "memberId": "1"}, {"id": "h2035", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Internet", "date": "2025-07-01", "memberId": "1"}, {"id": "h2036", "type": "out", "amount": 128.0, "categoryId": "co2", "note": "Benzina", "date": "2025-07-01", "memberId": "1"}, {"id": "h2037", "type": "out", "amount": 24.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2025-07-01", "memberId": "1"}, {"id": "h2038", "type": "out", "amount": 225.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2025-07-01", "memberId": "1"}, {"id": "h2039", "type": "out", "amount": 124.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2025-07-01", "memberId": "1"}, {"id": "h2040", "type": "out", "amount": 23.0, "categoryId": "co1", "note": "Caffè", "date": "2025-07-01", "memberId": "1"}, {"id": "h2041", "type": "out", "amount": 436.5, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2025-07-01", "memberId": "1"}, {"id": "h2042", "type": "out", "amount": 6.0, "categoryId": "co4", "note": "Libri/DVD", "date": "2025-07-01", "memberId": "1"}, {"id": "h2043", "type": "out", "amount": 20.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2025-07-01", "memberId": "1"}, {"id": "h2044", "type": "out", "amount": 49.0, "categoryId": "co3", "note": "Psicologo", "date": "2025-07-01", "memberId": "1"}, {"id": "h2045", "type": "out", "amount": 88.0, "categoryId": "co4", "note": "Sigarette", "date": "2025-07-01", "memberId": "1"}, {"id": "h2046", "type": "out", "amount": 20.0, "categoryId": "co3", "note": "Assicurazione sanitaria", "date": "2025-07-01", "memberId": "1"}, {"id": "h2047", "type": "out", "amount": 35.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2025-07-01", "memberId": "1"}, {"id": "h2048", "type": "out", "amount": 160.0, "categoryId": "co3", "note": "Dentista/Oculista/Dermatologa", "date": "2025-07-01", "memberId": "1"}, {"id": "h2049", "type": "out", "amount": 158.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2025-07-01", "memberId": "1"}, {"id": "h2050", "type": "out", "amount": 24.0, "categoryId": "co10", "note": "Viaggio", "date": "2025-07-01", "memberId": "1"}, {"id": "h2051", "type": "out", "amount": 679.0, "categoryId": "co10", "note": "Hotel e pernottamento", "date": "2025-07-01", "memberId": "1"}, {"id": "h2052", "type": "out", "amount": 276.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2025-07-01", "memberId": "1"}, {"id": "h2053", "type": "out", "amount": 83.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2025-07-01", "memberId": "1"}, {"id": "h2054", "type": "in", "amount": 1028.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2025-08-01", "memberId": "1"}, {"id": "h2055", "type": "in", "amount": 4440.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2025-08-01", "memberId": "1"}, {"id": "h2057", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2025-08-01", "memberId": "1"}, {"id": "h2058", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2025-08-01", "memberId": "1"}, {"id": "h2059", "type": "out", "amount": 84.0, "categoryId": "co0", "note": "Luce", "date": "2025-08-01", "memberId": "1"}, {"id": "h2060", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2025-08-01", "memberId": "1"}, {"id": "h2061", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Internet", "date": "2025-08-01", "memberId": "1"}, {"id": "h2062", "type": "out", "amount": 146.0, "categoryId": "co0", "note": "Imposte sugli immobili", "date": "2025-08-01", "memberId": "1"}, {"id": "h2063", "type": "out", "amount": 140.0, "categoryId": "co2", "note": "Benzina", "date": "2025-08-01", "memberId": "1"}, {"id": "h2064", "type": "out", "amount": 15.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2025-08-01", "memberId": "1"}, {"id": "h2065", "type": "out", "amount": 182.8, "categoryId": "co1", "note": "Generi alimentari", "date": "2025-08-01", "memberId": "1"}, {"id": "h2066", "type": "out", "amount": 156.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2025-08-01", "memberId": "1"}, {"id": "h2067", "type": "out", "amount": 20.0, "categoryId": "co1", "note": "Caffè", "date": "2025-08-01", "memberId": "1"}, {"id": "h2068", "type": "out", "amount": 330.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2025-08-01", "memberId": "1"}, {"id": "h2069", "type": "out", "amount": 5.0, "categoryId": "co4", "note": "Libri/DVD", "date": "2025-08-01", "memberId": "1"}, {"id": "h2070", "type": "out", "amount": 20.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2025-08-01", "memberId": "1"}, {"id": "h2071", "type": "out", "amount": 95.0, "categoryId": "co4", "note": "Sigarette", "date": "2025-08-01", "memberId": "1"}, {"id": "h2072", "type": "out", "amount": 10.0, "categoryId": "co8", "note": "Scuola figli (materiale, tasse)", "date": "2025-08-01", "memberId": "1"}, {"id": "h2073", "type": "out", "amount": 35.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2025-08-01", "memberId": "1"}, {"id": "h2074", "type": "out", "amount": 240.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2025-08-01", "memberId": "1"}, {"id": "h2075", "type": "out", "amount": 195.0, "categoryId": "co3", "note": "Dentista/Oculista/Dermatologa", "date": "2025-08-01", "memberId": "1"}, {"id": "h2076", "type": "out", "amount": 9.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2025-08-01", "memberId": "1"}, {"id": "h2077", "type": "out", "amount": 405.0, "categoryId": "co10", "note": "Viaggio", "date": "2025-08-01", "memberId": "1"}, {"id": "h2078", "type": "out", "amount": 80.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2025-08-01", "memberId": "1"}, {"id": "h2079", "type": "in", "amount": 1413.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2025-09-01", "memberId": "1"}, {"id": "h2080", "type": "in", "amount": 984.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2025-09-01", "memberId": "1"}, {"id": "h2081", "type": "in", "amount": 600.0, "categoryId": "ci2", "note": "Affitti da case di proprietà", "date": "2025-09-01", "memberId": "1"}, {"id": "h2082", "type": "out", "amount": 450.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2025-09-01", "memberId": "1"}, {"id": "h2083", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2025-09-01", "memberId": "1"}, {"id": "h2084", "type": "out", "amount": 12.0, "categoryId": "co0", "note": "Acqua", "date": "2025-09-01", "memberId": "1"}, {"id": "h2085", "type": "out", "amount": 179.0, "categoryId": "co0", "note": "Luce", "date": "2025-09-01", "memberId": "1"}, {"id": "h2086", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2025-09-01", "memberId": "1"}, {"id": "h2087", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Internet", "date": "2025-09-01", "memberId": "1"}, {"id": "h2088", "type": "out", "amount": 110.0, "categoryId": "co0", "note": "Imposte sugli immobili", "date": "2025-09-01", "memberId": "1"}, {"id": "h2089", "type": "out", "amount": 66.0, "categoryId": "co2", "note": "Assicurazione auto", "date": "2025-09-01", "memberId": "1"}, {"id": "h2090", "type": "out", "amount": 60.0, "categoryId": "co2", "note": "Benzina", "date": "2025-09-01", "memberId": "1"}, {"id": "h2091", "type": "out", "amount": 460.0, "categoryId": "co2", "note": "Riparazioni/Manutenzione", "date": "2025-09-01", "memberId": "1"}, {"id": "h2092", "type": "out", "amount": 114.0, "categoryId": "co2", "note": "Bollo auto", "date": "2025-09-01", "memberId": "1"}, {"id": "h2093", "type": "out", "amount": 270.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2025-09-01", "memberId": "1"}, {"id": "h2094", "type": "out", "amount": 171.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2025-09-01", "memberId": "1"}, {"id": "h2095", "type": "out", "amount": 160.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2025-09-01", "memberId": "1"}, {"id": "h2096", "type": "out", "amount": 20.0, "categoryId": "co1", "note": "Caffè", "date": "2025-09-01", "memberId": "1"}, {"id": "h2097", "type": "out", "amount": 395.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2025-09-01", "memberId": "1"}, {"id": "h2098", "type": "out", "amount": 20.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2025-09-01", "memberId": "1"}, {"id": "h2099", "type": "out", "amount": 49.0, "categoryId": "co3", "note": "Psicologo", "date": "2025-09-01", "memberId": "1"}, {"id": "h2100", "type": "out", "amount": 79.0, "categoryId": "co4", "note": "Sigarette", "date": "2025-09-01", "memberId": "1"}, {"id": "h2101", "type": "out", "amount": 35.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2025-09-01", "memberId": "1"}, {"id": "h2102", "type": "out", "amount": 10.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2025-09-01", "memberId": "1"}, {"id": "h2103", "type": "out", "amount": 100.0, "categoryId": "co3", "note": "Dentista/Oculista/Dermatologa", "date": "2025-09-01", "memberId": "1"}, {"id": "h2104", "type": "out", "amount": 148.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2025-09-01", "memberId": "1"}, {"id": "h2105", "type": "out", "amount": 30.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2025-09-01", "memberId": "1"}, {"id": "h2106", "type": "out", "amount": 21.0, "categoryId": "co3", "note": "Prodotti unghie/Fisioterapia/Massaggi", "date": "2025-09-01", "memberId": "1"}, {"id": "h2107", "type": "out", "amount": 78.0, "categoryId": "co10", "note": "Viaggio", "date": "2025-09-01", "memberId": "1"}, {"id": "h2108", "type": "out", "amount": 400.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2025-09-01", "memberId": "1"}, {"id": "h2109", "type": "out", "amount": 66.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2025-09-01", "memberId": "1"}, {"id": "h2110", "type": "in", "amount": 1413.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2025-10-01", "memberId": "1"}, {"id": "h2111", "type": "in", "amount": 949.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2025-10-01", "memberId": "1"}, {"id": "h2113", "type": "out", "amount": 500.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2025-10-01", "memberId": "1"}, {"id": "h2114", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2025-10-01", "memberId": "1"}, {"id": "h2115", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2025-10-01", "memberId": "1"}, {"id": "h2116", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Internet", "date": "2025-10-01", "memberId": "1"}, {"id": "h2117", "type": "out", "amount": 411.5, "categoryId": "co2", "note": "Assicurazione auto", "date": "2025-10-01", "memberId": "1"}, {"id": "h2118", "type": "out", "amount": 60.0, "categoryId": "co2", "note": "Benzina", "date": "2025-10-01", "memberId": "1"}, {"id": "h2119", "type": "out", "amount": 55.0, "categoryId": "co2", "note": "Bollo auto", "date": "2025-10-01", "memberId": "1"}, {"id": "h2120", "type": "out", "amount": 443.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2025-10-01", "memberId": "1"}, {"id": "h2121", "type": "out", "amount": 156.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2025-10-01", "memberId": "1"}, {"id": "h2122", "type": "out", "amount": 163.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2025-10-01", "memberId": "1"}, {"id": "h2123", "type": "out", "amount": 25.0, "categoryId": "co1", "note": "Caffè", "date": "2025-10-01", "memberId": "1"}, {"id": "h2124", "type": "out", "amount": 138.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2025-10-01", "memberId": "1"}, {"id": "h2125", "type": "out", "amount": 20.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2025-10-01", "memberId": "1"}, {"id": "h2126", "type": "out", "amount": 98.0, "categoryId": "co4", "note": "Sigarette", "date": "2025-10-01", "memberId": "1"}, {"id": "h2127", "type": "out", "amount": 35.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2025-10-01", "memberId": "1"}, {"id": "h2128", "type": "out", "amount": 50.0, "categoryId": "co3", "note": "Dentista/Oculista/Dermatologa", "date": "2025-10-01", "memberId": "1"}, {"id": "h2129", "type": "out", "amount": 303.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2025-10-01", "memberId": "1"}, {"id": "h2130", "type": "out", "amount": 27.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2025-10-01", "memberId": "1"}, {"id": "h2131", "type": "out", "amount": 36.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2025-10-01", "memberId": "1"}, {"id": "h2132", "type": "in", "amount": 2411.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2025-11-01", "memberId": "1"}, {"id": "h2134", "type": "out", "amount": 500.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2025-11-01", "memberId": "1"}, {"id": "h2135", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2025-11-01", "memberId": "1"}, {"id": "h2136", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2025-11-01", "memberId": "1"}, {"id": "h2137", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Internet", "date": "2025-11-01", "memberId": "1"}, {"id": "h2138", "type": "out", "amount": 500.0, "categoryId": "co0", "note": "Manutenzione/Riparazioni", "date": "2025-11-01", "memberId": "1"}, {"id": "h2139", "type": "out", "amount": 271.0, "categoryId": "co2", "note": "Assicurazione auto", "date": "2025-11-01", "memberId": "1"}, {"id": "h2140", "type": "out", "amount": 50.0, "categoryId": "co2", "note": "Benzina", "date": "2025-11-01", "memberId": "1"}, {"id": "h2141", "type": "out", "amount": 270.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2025-11-01", "memberId": "1"}, {"id": "h2142", "type": "out", "amount": 170.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2025-11-01", "memberId": "1"}, {"id": "h2143", "type": "out", "amount": 28.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2025-11-01", "memberId": "1"}, {"id": "h2144", "type": "out", "amount": 20.0, "categoryId": "co1", "note": "Caffè", "date": "2025-11-01", "memberId": "1"}, {"id": "h2145", "type": "out", "amount": 128.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2025-11-01", "memberId": "1"}, {"id": "h2146", "type": "out", "amount": 20.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2025-11-01", "memberId": "1"}, {"id": "h2147", "type": "out", "amount": 82.0, "categoryId": "co4", "note": "Sigarette", "date": "2025-11-01", "memberId": "1"}, {"id": "h2148", "type": "out", "amount": 150.0, "categoryId": "co8", "note": "Altro figli (mance, regali)", "date": "2025-11-01", "memberId": "1"}, {"id": "h2149", "type": "out", "amount": 35.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2025-11-01", "memberId": "1"}, {"id": "h2150", "type": "out", "amount": 10.0, "categoryId": "co9", "note": "Abbonamento palestra - sport", "date": "2025-11-01", "memberId": "1"}, {"id": "h2151", "type": "out", "amount": 180.0, "categoryId": "co3", "note": "Dentista/Oculista/Dermatologa", "date": "2025-11-01", "memberId": "1"}, {"id": "h2152", "type": "out", "amount": 54.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2025-11-01", "memberId": "1"}, {"id": "h2153", "type": "out", "amount": 26.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2025-11-01", "memberId": "1"}, {"id": "h2154", "type": "out", "amount": 9.0, "categoryId": "co3", "note": "Prodotti unghie/Fisioterapia/Massaggi", "date": "2025-11-01", "memberId": "1"}, {"id": "h2155", "type": "out", "amount": 139.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2025-11-01", "memberId": "1"}, {"id": "h2156", "type": "out", "amount": 205.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2025-11-01", "memberId": "1"}, {"id": "h2157", "type": "in", "amount": 1222.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2025-12-01", "memberId": "1"}, {"id": "h2158", "type": "in", "amount": 1427.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2025-12-01", "memberId": "1"}, {"id": "h2159", "type": "in", "amount": 706.0, "categoryId": "ci2", "note": "Affitti da case di proprietà", "date": "2025-12-01", "memberId": "1"}, {"id": "h2160", "type": "in", "amount": 508.0, "categoryId": "ci3", "note": "Dividendi da azioni", "date": "2025-12-01", "memberId": "1"}, {"id": "h2162", "type": "out", "amount": 500.0, "categoryId": "co0", "note": "Mutuo/Affitto", "date": "2025-12-01", "memberId": "1"}, {"id": "h2163", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2025-12-01", "memberId": "1"}, {"id": "h2164", "type": "out", "amount": 10.0, "categoryId": "co0", "note": "Telefonia", "date": "2025-12-01", "memberId": "1"}, {"id": "h2165", "type": "out", "amount": 30.0, "categoryId": "co0", "note": "Internet", "date": "2025-12-01", "memberId": "1"}, {"id": "h2166", "type": "out", "amount": 210.0, "categoryId": "co0", "note": "Imposte sugli immobili", "date": "2025-12-01", "memberId": "1"}, {"id": "h2167", "type": "out", "amount": 112.0, "categoryId": "co2", "note": "Benzina", "date": "2025-12-01", "memberId": "1"}, {"id": "h2168", "type": "out", "amount": 400.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2025-12-01", "memberId": "1"}, {"id": "h2169", "type": "out", "amount": 271.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2025-12-01", "memberId": "1"}, {"id": "h2170", "type": "out", "amount": 20.0, "categoryId": "co1", "note": "Caffè", "date": "2025-12-01", "memberId": "1"}, {"id": "h2171", "type": "out", "amount": 307.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2025-12-01", "memberId": "1"}, {"id": "h2172", "type": "out", "amount": 20.0, "categoryId": "co4", "note": "Netflix/Spotify/Amazon", "date": "2025-12-01", "memberId": "1"}, {"id": "h2173", "type": "out", "amount": 87.0, "categoryId": "co4", "note": "Sigarette", "date": "2025-12-01", "memberId": "1"}, {"id": "h2174", "type": "out", "amount": 35.0, "categoryId": "co3", "note": "Assicurazione sulla vita", "date": "2025-12-01", "memberId": "1"}, {"id": "h2175", "type": "out", "amount": 85.0, "categoryId": "co3", "note": "Dentista/Oculista/Dermatologa", "date": "2025-12-01", "memberId": "1"}, {"id": "h2176", "type": "out", "amount": 36.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2025-12-01", "memberId": "1"}, {"id": "h2177", "type": "out", "amount": 86.0, "categoryId": "co3", "note": "Prodotti unghie/Fisioterapia/Massaggi", "date": "2025-12-01", "memberId": "1"}, {"id": "h2178", "type": "out", "amount": 106.0, "categoryId": "co10", "note": "Regali per eventi (compleanni, matrimoni)", "date": "2025-12-01", "memberId": "1"}, {"id": "h2179", "type": "out", "amount": 33.0, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2025-12-01", "memberId": "1"}, {"id": "h2180", "type": "in", "amount": 2358.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2026-01-01", "memberId": "1"}, {"id": "h2181", "type": "in", "amount": 880.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2026-01-01", "memberId": "1"}, {"id": "h2184", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2026-01-01", "memberId": "1"}, {"id": "h2185", "type": "out", "amount": 139.0, "categoryId": "co0", "note": "Luce", "date": "2026-01-01", "memberId": "1"}, {"id": "h2188", "type": "out", "amount": 405.0, "categoryId": "co2", "note": "Assicurazione auto", "date": "2026-01-01", "memberId": "1"}, {"id": "h2189", "type": "out", "amount": 130.0, "categoryId": "co2", "note": "Benzina", "date": "2026-01-01", "memberId": "1"}, {"id": "h2190", "type": "out", "amount": 237.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2026-01-01", "memberId": "1"}, {"id": "h2191", "type": "out", "amount": 150.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2026-01-01", "memberId": "1"}, {"id": "h2193", "type": "out", "amount": 371.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2026-01-01", "memberId": "1"}, {"id": "h2194", "type": "out", "amount": 42.0, "categoryId": "co4", "note": "Cinema/Concerti/Teatro", "date": "2026-01-01", "memberId": "1"}, {"id": "h2196", "type": "out", "amount": 82.0, "categoryId": "co4", "note": "Sigarette", "date": "2026-01-01", "memberId": "1"}, {"id": "h2197", "type": "out", "amount": 40.0, "categoryId": "co8", "note": "Regali", "date": "2026-01-01", "memberId": "1"}, {"id": "h2198", "type": "out", "amount": 20.0, "categoryId": "co8", "note": "Scuola figli (materiale, tasse)", "date": "2026-01-01", "memberId": "1"}, {"id": "h2199", "type": "out", "amount": 236.0, "categoryId": "co8", "note": "Altro figli (mance, regali)", "date": "2026-01-01", "memberId": "1"}, {"id": "h2201", "type": "out", "amount": 180.0, "categoryId": "co3", "note": "Dentista/Oculista/Dermatologa", "date": "2026-01-01", "memberId": "1"}, {"id": "h2202", "type": "out", "amount": 63.0, "categoryId": "co3", "note": "Parrucchiere/Barbiere", "date": "2026-01-01", "memberId": "1"}, {"id": "h2203", "type": "out", "amount": 95.8, "categoryId": "co10", "note": "Animali (cibo, vaccini)", "date": "2026-01-01", "memberId": "1"}, {"id": "h2204", "type": "in", "amount": 1428.0, "categoryId": "ci0", "note": "Stipendi (o pensioni)", "date": "2026-02-01", "memberId": "1"}, {"id": "h2205", "type": "in", "amount": 864.0, "categoryId": "ci1", "note": "Cedole obbligazioni - fondi a cedola", "date": "2026-02-01", "memberId": "1"}, {"id": "h2206", "type": "in", "amount": 1180.0, "categoryId": "ci3", "note": "Regali familiari", "date": "2026-02-01", "memberId": "1"}, {"id": "h2209", "type": "out", "amount": 25.0, "categoryId": "co0", "note": "Dati Trading", "date": "2026-02-01", "memberId": "1"}, {"id": "h2212", "type": "out", "amount": 405.0, "categoryId": "co2", "note": "Assicurazione auto", "date": "2026-02-01", "memberId": "1"}, {"id": "h2213", "type": "out", "amount": 145.0, "categoryId": "co2", "note": "Benzina", "date": "2026-02-01", "memberId": "1"}, {"id": "h2214", "type": "out", "amount": 40.0, "categoryId": "co2", "note": "Bollo auto", "date": "2026-02-01", "memberId": "1"}, {"id": "h2215", "type": "out", "amount": 220.0, "categoryId": "co1", "note": "Generi alimentari", "date": "2026-02-01", "memberId": "1"}, {"id": "h2216", "type": "out", "amount": 102.0, "categoryId": "co1", "note": "Cibo a domicilio - da asporto", "date": "2026-02-01", "memberId": "1"}, {"id": "h2217", "type": "out", "amount": 41.0, "categoryId": "co5", "note": "Abbigliamento", "date": "2026-02-01", "memberId": "1"}, {"id": "h2219", "type": "out", "amount": 43.0, "categoryId": "co11", "note": "Ristorante/Locali/Bar", "date": "2026-02-01", "memberId": "1"}, {"id": "h2221", "type": "out", "amount": 50.0, "categoryId": "co4", "note": "Sigarette", "date": "2026-02-01", "memberId": "1"}, {"id": "h2223", "type": "out", "amount": 169.0, "categoryId": "co3", "note": "Medicinali e analisi", "date": "2026-02-01", "memberId": "1"}, {"id": "h2224", "type": "out", "amount": 20.0, "categoryId": "co10", "note": "Spese in viaggio", "date": "2026-02-01", "memberId": "1"}];

const INIT_TRANSACTIONS = [...HISTORICAL_TRANSACTIONS, 
  { id:"t01", type:"in",  amount:643,  categoryId:"ci0", note:"Stipendio 1",    date:"2026-03-01", memberId:"1" },
  { id:"t02", type:"in",  amount:293,  categoryId:"ci0", note:"Stipendio 2",      date:"2026-03-01", memberId:"1" },
  { id:"t03", type:"in",  amount:737,  categoryId:"ci0", note:"Stipendio3",            date:"2026-03-01", memberId:"1" },
  { id:"t04", type:"in",  amount:466,  categoryId:"ci0", note:"Stipendio4",            date:"2026-03-01", memberId:"1" },
  { id:"t05", type:"in",  amount:1086, categoryId:"ci0", note:"Altro - Regali",        date:"2026-03-01", memberId:"1" },
  { id:"t10", type:"out", amount:105,  categoryId:"co0", note:"Acqua",                 date:"2026-03-05", memberId:"1" },
  { id:"t11", type:"out", amount:20,   categoryId:"co0", note:"Manutenzione",          date:"2026-03-10", memberId:"1" },
  { id:"t12", type:"out", amount:66,   categoryId:"co0", note:"Varie casa",            date:"2026-03-15", memberId:"1" },
  { id:"t13", type:"out", amount:204,  categoryId:"co1", note:"Generi alimentari",     date:"2026-03-07", memberId:"1" },
  { id:"t14", type:"out", amount:21,   categoryId:"co1", note:"Cibo a domicilio",      date:"2026-03-12", memberId:"1" },
  { id:"t15", type:"out", amount:30,   categoryId:"co5", note:"Abbigliamento",         date:"2026-03-14", memberId:"1" },
  { id:"t16", type:"out", amount:135,  categoryId:"co11", note:"Ristorante/Locali/Bar", date:"2026-03-08", memberId:"1" },
  { id:"t17", type:"out", amount:50,   categoryId:"co4", note:"Sigarette",             date:"2026-03-10", memberId:"1" },
  { id:"t18", type:"out", amount:60,   categoryId:"co4", note:"Giardinaggio",          date:"2026-03-18", memberId:"1" },
  { id:"t19", type:"out", amount:122,  categoryId:"co8", note:"Varie figli",           date:"2026-03-09", memberId:"1" },
  { id:"t20", type:"out", amount:48,   categoryId:"co9", note:"Abbonamento palestra",  date:"2026-03-02", memberId:"1" },
  { id:"t21", type:"out", amount:100,  categoryId:"co3", note:"Visite mediche",        date:"2026-03-11", memberId:"1" },
  { id:"t22", type:"out", amount:69,   categoryId:"co3", note:"Medicinali e analisi",  date:"2026-03-16", memberId:"1" },
  { id:"t23", type:"out", amount:31,   categoryId:"co10",note:"Regali eventi",         date:"2026-03-20", memberId:"1" },
  { id:"t24", type:"out", amount:19,   categoryId:"co10",note:"Animali",               date:"2026-03-13", memberId:"1" },
];
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
const MONTHS_SHORT = ["gen","feb","mar","apr","mag","giu","lug","ago","set","ott","nov","dic"];
const fmtDate = s => { const d = new Date(s+"T00:00:00"); return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`; };
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
  const [page, setPage]   = useState("login");
  const [loaded, setLoaded] = useState(false);
  const [savedMsg, setSavedMsg] = React.useState(false);
  

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

  // ══════════════════════════════════════════════════════════════════════
  // 👉 INSERISCI QUI LE TUE CREDENZIALI SUPABASE
  // ══════════════════════════════════════════════════════════════════════
  const SUPABASE_URL      = "https://xphnbdgltaedbcmiclrk.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwaG5iZGdsdGFlZGJjbWljbHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjg4NjgsImV4cCI6MjA4OTYwNDg2OH0.j_iVVLkmuBC1GxwDPdVL9IDZJtnPqTWp_no3BDA0vhc";
  // ══════════════════════════════════════════════════════════════════════

  const FAMILY_ID = "famiglia_principale";
  const isConfigured = SUPABASE_URL.startsWith("https://") && SUPABASE_ANON_KEY.startsWith("eyJ");

  const sbHeaders = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates,return=minimal",
  };

  // ── Carica da Supabase al mount ─────────────────────────────────────────
  React.useEffect(() => {
    const load = async () => {
      if (!isConfigured) { setLoaded(true); return; }
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/appdata?family_id=eq.${FAMILY_ID}&select=data`,
          { headers: sbHeaders }
        );
        if (res.ok) {
          const rows = await res.json();
          if (rows.length > 0) {
            const d = rows[0].data;
            if (d.userTxs)       setUserTxs(d.userTxs);
            if (d.deletedIds)    setDeletedIds(d.deletedIds);
            if (d.members)       setMembers(d.members);
            if (d.currentMember) setCurrentMember(d.currentMember);
            if (d.recurring)     setRecurring(d.recurring);
            if (d.budgets)       setBudgets(d.budgets);
          }
        }
      } catch (e) { console.error("Caricamento fallito:", e); }
      setLoaded(true);
    };
    load();
  }, []);

  // ── Salva su Supabase ────────────────────────────────────────────────────
  const _savePayload = React.useRef(null);
  const _saveTimer = React.useRef(null);

  const saveNow = React.useCallback(async (payload) => {
    if (!isConfigured) return;
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/appdata`, {
        method: "POST",
        headers: sbHeaders,
        body: JSON.stringify({ family_id: FAMILY_ID, data: payload }),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error("Salvataggio fallito:", res.status, errText);
      } else {
        setSavedMsg(true);
        setTimeout(() => setSavedMsg(false), 2000);
      }
    } catch (e) { console.error("Salvataggio fallito (rete):", e); }
  }, [isConfigured, SUPABASE_URL, FAMILY_ID, sbHeaders]);

  React.useEffect(() => {
    if (!loaded || !isConfigured) return;
    const payload = { userTxs, deletedIds, members, currentMember, recurring, budgets };
    _savePayload.current = payload;
    clearTimeout(_saveTimer.current);
    _saveTimer.current = setTimeout(() => saveNow(payload), 1500);
    return () => clearTimeout(_saveTimer.current);
  }, [loaded, userTxs, deletedIds, members, currentMember, recurring, budgets]);

  // Salva immediatamente se l'utente chiude/ricarica la pagina
  React.useEffect(() => {
    if (!loaded || !isConfigured) return;
    const handleUnload = () => {
      if (_savePayload.current) {
        clearTimeout(_saveTimer.current);
        // navigator.sendBeacon non supporta header custom — usiamo fetch con keepalive
        fetch(`${SUPABASE_URL}/rest/v1/appdata`, {
          method: "POST",
          headers: sbHeaders,
          body: JSON.stringify({ family_id: FAMILY_ID, data: _savePayload.current }),
          keepalive: true,
        });
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [loaded, isConfigured]);

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

  
  if (page === "login") return <LoginPage members={members} onLogin={id=>{setCurrentMember(id);setPage("app");}} onAddMember={m=>setMembers(ms=>[...ms,m])}/>;

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:SF,
      maxWidth:430,margin:"0 auto",WebkitFontSmoothing:"antialiased"}}>

      {/* ── Toast Salvato ── */}
      {savedMsg && (
        <div style={{
          position:"fixed",top:60,left:"50%",transform:"translateX(-50%)",
          background:"rgba(48,209,88,0.18)",backdropFilter:"blur(20px)",
          border:"0.5px solid rgba(48,209,88,0.35)",borderRadius:20,
          padding:"8px 18px",fontSize:13,fontWeight:600,color:C.green,
          zIndex:200,pointerEvents:"none",
        }}>
          {savedMsg==="aggiunto" ? "✓ Movimento aggiunto" : savedMsg==="modifica" ? "✓ Modifica salvata" : "✓ Salvato"}
        </div>
      )}

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
        <div style={{display:"flex",gap:8,marginTop:8}}>
          <button onClick={()=>setTab("family")} title="Famiglia" style={{
            width:36,height:36,borderRadius:"50%",
            background:tab==="family"?C.accent:C.glassMd,
            backdropFilter:"blur(20px)",border:`0.5px solid ${C.borderHi}`,
            color:tab==="family"?"#fff":C.textSec,cursor:"pointer",
            fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",
          }}>👨‍👩‍👧</button>
          
        </div>
      </header>

      {/* ── Selettore mese ── */}
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 22px 0"}}>
        <button onClick={()=>{if(filterMonth===0){setFilterMonth(11);setFilterYear(y=>y-1);}else setFilterMonth(m=>m-1);}}
          style={{width:44,height:44,borderRadius:"50%",background:C.glassMd,
            border:`0.5px solid ${C.borderHi}`,color:C.text,cursor:"pointer",
            fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>‹</button>
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
          style={{width:44,height:44,borderRadius:"50%",background:C.glassMd,
            border:`0.5px solid ${C.borderHi}`,color:C.text,cursor:"pointer",
            fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>›</button>
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
          {id:"budget",    label:"Budget",  icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M12 8v4l2.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>},
          {id:"recurring", label:"Fissi",   icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M20 12a8 8 0 01-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M4 8V4h4M20 16v4h-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>},
          {id:"__today",   label:"Oggi",    icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.6"/><path d="M3 9h18" stroke="currentColor" strokeWidth="1.6"/><path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="12" cy="15" r="1.5" fill="currentColor"/></svg>},
        ].map(({id,label,icon}) => id==="__today" ? (
          <button key={id} onClick={()=>{setFilterMonth(now.getMonth());setFilterYear(now.getFullYear());setTab("dashboard");}} style={{
            flex:1,padding:"2px 2px 4px",border:"none",cursor:"pointer",background:"transparent",
            color:(filterMonth===now.getMonth()&&filterYear===now.getFullYear())?C.accent:"rgba(255,255,255,0.32)",
            display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"color 0.15s",
          }}>
            {icon}
            <span style={{fontSize:10,fontWeight:(filterMonth===now.getMonth()&&filterYear===now.getFullYear())?600:400,letterSpacing:-0.1}}>{label}</span>
          </button>
        ) : (
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
            setSavedMsg(modal==="edit"?"modifica":"aggiunto");
            setTimeout(()=>setSavedMsg(false),2000);
          }}/>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────────────────────

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
        {totalIn>0 && (()=>{
          const savingsPct = Math.round((balance/totalIn)*100);
          const isPositive = balance >= 0;
          const barColor = isPositive ? "linear-gradient(90deg,#30d158,#1eb84a)" : "linear-gradient(90deg,#ff453a,#d93025)";
          const barWidth = isPositive
            ? `${Math.min((balance/totalIn)*100,100)}%`
            : `${Math.min(Math.abs(balance/totalIn)*100,100)}%`;
          return (
            <div style={{margin:"18px 0 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:10,fontWeight:500,color:"rgba(255,255,255,0.32)",letterSpacing:0.3}}>
                  {isPositive ? "Tasso di risparmio" : "Sforamento"}
                </span>
                <span style={{fontSize:10,fontWeight:600,color:isPositive?C.green:C.red}}>
                  {isPositive?"+":""}{savingsPct}%
                </span>
              </div>
              <div style={{height:2.5,borderRadius:2,background:"rgba(255,255,255,0.07)",overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:2,width:barWidth,background:barColor}}/>
              </div>
            </div>
          );
        })()}
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

      {/* ── Stato vuoto ── */}
      {allTx.length===0 && (
        <div style={{background:C.card,border:`0.5px solid ${C.borderHi}`,borderRadius:24,padding:"32px 20px",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:12}}>💸</div>
          <p style={{margin:"0 0 6px",fontSize:15,fontWeight:600,color:C.text}}>Nessun movimento questo mese</p>
          <p style={{margin:0,fontSize:13,color:C.textSec}}>Tocca <strong style={{color:C.accent}}>+</strong> per aggiungere entrate o uscite</p>
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
                  <p style={{margin:0,fontSize:11,color:C.textSec}}>{cat.name} · {fmtDate(t.date)}</p>
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
  const [typeFilter, setTypeFilter] = useState("all");
  const [undoItem, setUndoItem] = useState(null);
  const undoTimer = React.useRef(null);

  const sorted = useMemo(() => allTx.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)), [allTx]);
  const filtered = useMemo(() => sorted.filter(t => {
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    if (!search) return true;
    return (t.note||"").toLowerCase().includes(search.toLowerCase()) ||
      (allCats.find(c=>c.id===t.categoryId)?.name||"").toLowerCase().includes(search.toLowerCase());
  }), [sorted, search, typeFilter, allCats]);

  const handleDelete = (t) => {
    setUndoItem(t);
    clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => { onDelete(t.id); setUndoItem(null); }, 3000);
  };
  const handleUndo = () => { clearTimeout(undoTimer.current); setUndoItem(null); };

  return (
    <div>
      {/* Undo toast */}
      {undoItem && (
        <div style={{
          position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",
          background:"rgba(30,30,34,0.97)",backdropFilter:"blur(20px)",
          border:"0.5px solid rgba(255,255,255,0.12)",borderRadius:16,
          padding:"12px 16px",display:"flex",alignItems:"center",gap:14,
          zIndex:300,boxShadow:"0 8px 32px rgba(0,0,0,0.5)",minWidth:260,
        }}>
          <span style={{flex:1,fontSize:13,color:C.textSec}}>Movimento eliminato</span>
          <button onClick={handleUndo} style={{
            padding:"6px 14px",borderRadius:10,border:"none",
            background:C.accent,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600,
          }}>Annulla</button>
        </div>
      )}
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
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {[["all","Tutti"],["out","Uscite"],["in","Entrate"]].map(([v,label])=>(
          <button key={v} onClick={()=>setTypeFilter(v)} style={{
            flex:1,padding:"7px 4px",borderRadius:10,border:"none",cursor:"pointer",
            fontSize:12,fontWeight:600,
            background:typeFilter===v?(v==="out"?C.redDim:v==="in"?C.greenDim:C.glassMd):C.glass,
            color:typeFilter===v?(v==="out"?C.red:v==="in"?C.green:C.text):C.textSec,
            outline:typeFilter===v?`1px solid ${v==="out"?C.red:v==="in"?C.green:C.borderHi}`:"none",
          }}>{label}</button>
        ))}
      </div>
      <div style={{background:C.card,border:`0.5px solid ${C.borderHi}`,borderRadius:24,overflow:"hidden"}}>
        {filtered.length===0 && (
          <div style={{padding:32,textAlign:"center",color:C.textSec,fontSize:14}}>
            Nessun movimento trovato
          </div>
        )}
        {filtered.map((t,i)=>{
          const cat = allCats.find(c=>c.id===t.categoryId)||{name:"Altro",icon:"📦",color:C.muted};
          const isDeleting = undoItem?.id === t.id;
          return (
            <div key={t.id} style={{
              display:"flex",alignItems:"center",gap:12,padding:"12px 16px",
              borderBottom:i<filtered.length-1?"0.5px solid rgba(255,255,255,0.05)":"none",
              opacity:isDeleting?0.3:1,transition:"opacity 0.2s",
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
                <p style={{margin:0,fontSize:11,color:C.textSec}}>{cat.name} · {fmtDate(t.date)}</p>
              </div>
              <AmountBadge amount={t.amount} type={t.type}/>
              {!t.isRecurring && (
                <div style={{display:"flex",gap:6,flexShrink:0}}>
                  <button onClick={()=>onEdit(t)} style={{
                    width:28,height:28,borderRadius:8,border:"none",
                    background:"rgba(10,132,255,0.12)",color:C.accent,
                    cursor:"pointer",fontSize:13,flexShrink:0,
                    display:"flex",alignItems:"center",justifyContent:"center",
                  }}>✏️</button>
                  <button onClick={()=>handleDelete(t)} style={{
                    width:28,height:28,borderRadius:8,border:"none",
                    background:"rgba(255,69,58,0.12)",color:C.red,
                    cursor:"pointer",fontSize:14,flexShrink:0,
                    display:"flex",alignItems:"center",justifyContent:"center",
                  }}>×</button>
                </div>
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
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [infoMsg, setInfoMsg] = useState(null);
  const showInfo = (msg, isError=false) => { setInfoMsg({msg,isError}); setTimeout(()=>setInfoMsg(null),3000); };

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
      showInfo("Errore export: " + e.message, true);
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
      showInfo("Dati importati con successo!");
    } catch(e) { showInfo("Errore nel file JSON: " + e.message, true); }
  };

  return (
    <div>
      {infoMsg && (
        <div style={{
          position:"fixed",top:60,left:"50%",transform:"translateX(-50%)",
          background:infoMsg.isError?"rgba(255,69,58,0.18)":"rgba(48,209,88,0.18)",
          backdropFilter:"blur(20px)",
          border:`0.5px solid ${infoMsg.isError?"rgba(255,69,58,0.35)":"rgba(48,209,88,0.35)"}`,
          borderRadius:20,padding:"8px 18px",fontSize:13,fontWeight:600,
          color:infoMsg.isError?C.red:C.green,zIndex:200,pointerEvents:"none",
        }}>{infoMsg.isError?"⚠️":"✓"} {infoMsg.msg}</div>
      )}
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
                confirmRemove===m.id ? (
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>{setMembers(ms=>ms.filter(x=>x.id!==m.id));setConfirmRemove(null);}}
                      style={{padding:"8px 12px",borderRadius:8,border:"none",background:C.red,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:700}}>
                      Sì, rimuovi
                    </button>
                    <button onClick={()=>setConfirmRemove(null)}
                      style={{padding:"8px 12px",borderRadius:8,border:"none",background:C.surface,color:C.muted,cursor:"pointer",fontSize:12}}>
                      Annulla
                    </button>
                  </div>
                ) : (
                  <button onClick={()=>setConfirmRemove(m.id)}
                    style={{padding:"8px 12px",borderRadius:8,border:"none",background:C.surface,color:C.red,cursor:"pointer",fontSize:12}}>
                    Rimuovi
                  </button>
                )
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
