export function buildAIPrompt({
  userData = {},
  recentLogs = [],
  recentSymptoms = [],
}) {
  const pcosContext =
    userData.pcos !== false
      ? "The user has been diagnosed with PCOS."
      : "The user is tracking their reproductive wellness.";

  const logContext =
    recentLogs.length > 0
      ? `Recent logs indicate they slept an average of ${recentLogs[0].sleep} hours today, drank ${recentLogs[0].water}L of water, and exercised for ${recentLogs[0].exercise} minutes.`
      : "No recent daily logs submitted yet.";

  const symptomContext =
    recentSymptoms.length > 0
      ? `They reported experiencing today: ${recentSymptoms.map((s) => `${s.type} (Severity: ${s.severity}/5)`).join(", ")}.`
      : "No recent symptoms reported.";

  return `
    ${pcosContext}
    ${logContext}
    ${symptomContext}

    Act as a friendly, supportive health coach. 
    Provide 2-3 short, actionable tips based on their recent health data. 
    Explain the reasoning behind your tips gently. 
    Maintain an encouraging and supportive tone, but DO NOT provide medical diagnoses.
  `.trim();
}
