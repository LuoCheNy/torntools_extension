"use strict";

(async () => {
	if ((await checkDevice()).mobile) return "Not supported on mobile!";
	else if (isFlying()) return;

	featureManager.registerFeature(
		"NPC Loot Times",
		"sidebar",
		() => settings.pages.sidebar.npcLootTimes,
		null,
		showNPCs,
		removeNPCs,
		{
			storage: ["settings.pages.sidebar.npcLootTimes", "npcs.targets"],
		},
		() => {
			if (!settings.external.yata) return "YATA not enabled";
		}
	);

	async function showNPCs() {
		await requireSidebar();

		const { content } = createContainer("NPCs", {
			id: "npc-loot-times",
			applyRounding: false,
			// compact: true,
			previousElement: findParent(document.find("h2=Information"), { class: "^=sidebar-block_" }),
		});

		const now = Date.now();
		for (const [id, npc] of Object.entries(npcs.targets)) {
			const status = npc.current === 0 ? "Hospital" : "Okay";

			const next = npc.current !== 5 ? npc.current + 1 : false;

			let timer;
			if (next) {
				const left = npc.levels[next] - now;

				const settings = { type: "wordTimer", extraShort: true };
				timer = document.newElement({
					type: "span",
					class: "timer",
					text: formatTime(left, settings),
					dataset: {
						seconds: (left / TO_MILLIS.SECONDS).dropDecimals(),
						timeSettings: settings,
					},
				});

				countdownTimers.push(timer);
			} else timer = document.newElement({ type: "span", class: "timer", text: "TODO" });

			console.log("DKK npc", npc.current);
			content.appendChild(
				document.newElement({
					type: "div",
					class: "tt-npc",
					children: [
						document.newElement({ type: "a", class: "npc-name", href: `https://www.torn.com/profiles.php?XID=${id}`, text: `${npc.name} [${id}]` }),
						document.newElement({
							type: "div",
							class: "npc-information",
							children: [
								document.newElement({ type: "span", class: `status ${status.toLowerCase()}`, text: status }),
								document.newElement({ type: "span", text: " / " }),
								document.newElement({ type: "span", class: "loot-level", text: npc.current }),
								document.newElement({ type: "span", text: " / " }),
								timer,
							],
						}),
					],
				})
			);
		}
	}

	function removeNPCs() {
		removeContainer("NPCs", { id: "npc-loot-times" });
	}
})();
