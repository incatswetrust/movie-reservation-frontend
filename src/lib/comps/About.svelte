<section class="bg-app">
	<div class="container mx-auto flex min-h-[calc(100vh-4rem)] items-center px-5 py-16">
		<div class="card mx-auto w-full max-w-3xl p-8">
			<h1
				class="mb-6 text-center text-[clamp(32px,4vw,48px)] font-bold leading-[1.05] tracking-[-0.02em] text-ink"
			>
				About Movie Reservation System
			</h1>
			<p class="mb-4 text-[15px] leading-relaxed text-ink-secondary">
				I built this <strong class="text-ink">Movie Reservation System</strong> to streamline the process
				of booking tickets and selecting seats through a clean, user-centric interface. On the backend,
				I use <strong class="text-ink">C# + ASP.NET Core</strong> along with
				<strong class="text-ink">Entity Framework Core</strong> and SQL Server to model the domain and
				serve movies, cinemas, halls, showtimes, and bookings.
			</p>
			<p class="mb-4 text-[15px] leading-relaxed text-ink-secondary">
				For security, I use <strong class="text-ink">JWT access tokens with rotating refresh tokens</strong>,
				BCrypt-hashed passwords, and optional <strong class="text-ink">Google OAuth</strong> sign-in. Access
				is role-based across three tiers — <strong class="text-ink">Admin</strong> gets full control,
				<strong class="text-ink">Viewer</strong> can browse the entire admin panel read-only, and regular
				<strong class="text-ink">User</strong> accounts can search, filter, and book. Every booking is
				checked against live seat availability before it's confirmed.
			</p>
			<p class="mb-4 text-[15px] leading-relaxed text-ink-secondary">
				On the frontend side, I've employed <strong class="text-ink">SvelteKit 5</strong> and
				<strong class="text-ink">Tailwind CSS</strong> to build a visual seat-map booking flow, debounced
				search and filtering, and a consistent design system with full dark/light theme support across
				every page. Whether you're a casual movie buff or someone who monitors every new release, I wanted
				the system to feel both welcoming and modern.
			</p>
			<p class="mb-8 text-[15px] leading-relaxed text-ink-secondary">
				Ultimately, my goal is to blend scalability, security, and performance with a clean design.
				By combining a robust technology stack with modern design principles, I've created a reservation
				system that showcases my passion for both software engineering and user experience.
			</p>

			<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
				<a href="/cinemas" class="btn-primary">To search for movies</a>

				<div class="flex gap-5">
					<a
						href="https://github.com/incatswetrust/MovieReservationSystem.Backend"
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-2 text-sm text-ink-secondary transition-colors duration-fast hover:text-brand-gold"
					>
						<svg fill="currentColor" viewBox="0 0 24 24" class="h-5 w-5 shrink-0">
							<path
								d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303
              3.438 9.8 8.205 11.387.6.113.82-.258.82-.577
              0-.285-.01-1.04-.015-2.04-3.338.73-4.042-1.61-4.042-1.61
              -.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.084-.73.084-.73
              1.205.084 1.84 1.238 1.84 1.238 1.07 1.835 2.807 1.303 3.492.997
              .108-.776.417-1.303.76-1.603-2.665-.303-5.466-1.332-5.466-5.93
              0-1.31.47-2.382 1.235-3.223-.123-.304-.535-1.524.117-3.176
              0 0 1.008-.322 3.301 1.23.96-.267
              1.98-.399 3-.405 1.02.006
              2.04.138 3 .405 2.289-1.552
              3.295-1.23 3.295-1.23.656 1.652.244 2.872.12 3.176.77.841
              1.236 1.913 1.236 3.223
              0 4.61-2.807 5.624-5.479 5.92.43.369.81
              1.096.81 2.21 0 1.596-.014
              2.882-.014 3.274 0 .32.216.694.825.576
              4.765-1.587 8.2-6.084 8.2-11.386
              0-6.627-5.373-12-12-12z"
							/>
						</svg>
						Backend repo
					</a>

					<a
						href="https://github.com/incatswetrust/movie-reservation-frontend"
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-2 text-sm text-ink-secondary transition-colors duration-fast hover:text-brand-gold"
					>
						<svg fill="currentColor" viewBox="0 0 24 24" class="h-5 w-5 shrink-0">
							<path
								d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303
              3.438 9.8 8.205 11.387.6.113.82-.258.82-.577
              0-.285-.01-1.04-.015-2.04-3.338.73-4.042-1.61-4.042-1.61
              -.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.084-.73.084-.73
              1.205.084 1.84 1.238 1.84 1.238 1.07 1.835 2.807 1.303 3.492.997
              .108-.776.417-1.303.76-1.603-2.665-.303-5.466-1.332-5.466-5.93
              0-1.31.47-2.382 1.235-3.223-.123-.304-.535-1.524.117-3.176
              0 0 1.008-.322 3.301 1.23.96-.267
              1.98-.399 3-.405 1.02.006
              2.04.138 3 .405 2.289-1.552
              3.295-1.23 3.295-1.23.656 1.652.244 2.872.12 3.176.77.841
              1.236 1.913 1.236 3.223
              0 4.61-2.807 5.624-5.479 5.92.43.369.81
              1.096.81 2.21 0 1.596-.014
              2.882-.014 3.274 0 .32.216.694.825.576
              4.765-1.587 8.2-6.084 8.2-11.386
              0-6.627-5.373-12-12-12z"
							/>
						</svg>
						Frontend repo
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
