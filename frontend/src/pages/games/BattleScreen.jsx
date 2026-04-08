import { useState } from "react";
import { motion } from "framer-motion";
import "./battle.css";

export default function BattleScreen() {
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(100);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState("");

  const isGameOver = playerHP === 0 || enemyHP === 0;

  const questions = [
    {
      question: "Find two numbers that sum to target",
      options: ["HashMap", "Sorting", "Recursion"],
      answer: "HashMap",
    },
    {
      question: "Find maximum subarray sum",
      options: ["Greedy (Kadane)", "Brute Force", "Binary Search"],
      answer: "Greedy (Kadane)",
    },
  ];

  const handleAnswer = (option) => {
    if (isGameOver) return;

    // 💥 screen shake
    document.body.classList.add("shake");
    setTimeout(() => document.body.classList.remove("shake"), 200);

    if (option === questions[questionIndex].answer) {
      const damage = 20 + combo * 5;
      setEnemyHP((prev) => Math.max(prev - damage, 0));
      setCombo((prev) => prev + 1);
      setFeedback(`🔥 Critical Hit! -${damage}`);
    } else {
      setPlayerHP((prev) => Math.max(prev - 20, 0));
      setCombo(0);
      setFeedback("❌ Wrong Move! -20");
    }

    setTimeout(() => setFeedback(""), 800);

    if (!isGameOver) {
      setQuestionIndex((prev) => (prev + 1) % questions.length);
    }
  };

  return (
    <div className="h-screen bg-[radial-gradient(circle_at_center,#0f172a,#020617)] text-white flex flex-col items-center justify-center p-4">

      {/* Title */}
      <h1 className="text-4xl font-bold mb-6 text-yellow-400 drop-shadow-lg">
        ⚔️ Algo Battle Arena
      </h1>

      {/* Combo */}
      {combo > 1 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-2 text-orange-400 font-bold text-xl"
        >
          🔥 Combo x{combo}
        </motion.div>
      )}

      {/* Battle Area */}
      <div className="flex justify-between items-center w-full max-w-3xl mb-10">

        {/* Player */}
        <div className="text-center">
          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
            className="w-20 mx-auto mb-2"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          <p className="text-yellow-300 font-bold">Player</p>

          <div className="w-40 mt-2">
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-400"
                animate={{ width: `${playerHP}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <p className="text-sm mt-1">{playerHP} HP</p>
          </div>
        </div>

        {/* Enemy */}
        <div className="text-center">
          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
            className="w-20 mx-auto mb-2"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          <p className="text-red-400 font-bold">Enemy</p>

          <div className="w-40 mt-2">
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-red-500"
                animate={{ width: `${enemyHP}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <p className="text-sm mt-1">{enemyHP} HP</p>
          </div>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1.5, opacity: [1, 0] }}
          className="absolute text-xl font-bold text-white"
        >
          {feedback}
        </motion.div>
      )}

      {/* Question Card */}
      <motion.div
        key={questionIndex}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md text-center border border-gray-700"
      >
        <h2 className="text-lg mb-5">
          {questions[questionIndex].question}
        </h2>

        <div className="flex flex-col gap-4">
          {questions[questionIndex].options.map((option, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleAnswer(option)}
              disabled={isGameOver}
              className={`p-3 rounded-xl font-semibold transition ${
                isGameOver
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/40"
              }`}
            >
              ⚔️ {option}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Result */}
      {enemyHP === 0 && (
        <motion.p
          initial={{ scale: 0 }}
          animate={{ scale: 1.5 }}
          className="mt-6 text-green-400 font-bold text-xl"
        >
          🎉 Victory!
        </motion.p>
      )}

      {playerHP === 0 && (
        <motion.p
          initial={{ scale: 0 }}
          animate={{ scale: 1.5 }}
          className="mt-6 text-red-400 font-bold text-xl"
        >
          💀 Defeat!
        </motion.p>
      )}
    </div>
  );
}