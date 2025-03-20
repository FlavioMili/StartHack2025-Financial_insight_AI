const fs = require('fs');
const path = require('path');

console.log("diocane");

function jsonToHtml(jsonData) {
    console.log("diocane");
    const data = JSON.parse(jsonData);
    const responses = data.responses || [];
    
    let htmlOutput = '<div class="keypoints">';
    
    responses.forEach(response => {
        response.keypoints.forEach((keypoint, index) => {
            htmlOutput += `<div class="keypoint">`;
            htmlOutput += `<h3>${index + 1}. ${keypoint.title}</h3>`;
            htmlOutput += '<ul>';
            keypoint.points.forEach(point => {
                htmlOutput += `<li>${point}</li>`;
            });
            htmlOutput += '</ul>';
            htmlOutput += '</div>';
        });
    });
    
    htmlOutput += '</div>';
    return htmlOutput;
}

async function loadRealTimeAnalysis() {
    console.log("diocane2");
    try {
        const response = await fetch('/assets/llm_response_example.json');
        const data = await response.json();
        const responseBox = document.querySelector('.response-box');
        
        if (!responseBox) {
            console.error("Elemento .response-box non trovato nel DOM!");
            return;
        }

        responseBox.innerHTML = jsonToHtml(data);
    } catch (error) {
        console.error("Errore nel caricamento del JSON:", error);
    }
}
console.log("Test script caricato");

loadRealTimeAnalysis();
