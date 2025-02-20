<section class="min-h-screen bg-black bg-opacity-90 text-cyan-300 flex items-center justify-center">
    <div class="max-w-3xl w-full bg-black bg-opacity-80 border border-cyan-600 rounded p-8">
      <h1 class="text-4xl font-bold mb-6 drop-shadow-[0_0_5px_#0ff] text-cyan-100 text-center">
        About Movie Reservation System
      </h1>
      <p class="leading-relaxed mb-4 text-cyan-300">
        I built this <strong>Movie Reservation System</strong> to streamline the process of booking tickets and selecting seats 
        through a futuristic, user-centric interface. On the backend, I use <strong>C# + ASP.NET Core</strong> along with 
        <strong>Entity Framework (EF Core)</strong> to model my entities and communicate with a <strong>PostgreSQL</strong> database. 
        By containerizing everything with <strong>Docker</strong>, I ensure consistent and hassle-free deployments.
      </p>
      <p class="leading-relaxed mb-4 text-cyan-300">
        For security, I rely on <strong>JWT authentication</strong> to provide role-based access and safe data transactions. 
        My scheduling logic offers real-time seat availability, guaranteeing users can see precisely which seats are free 
        at any moment. Thanks to <strong>EF Core</strong> and my carefully structured business logic, every step—from adding 
        new movies to managing showtimes—is designed to be maintainable and efficient.
      </p>
      <p class="leading-relaxed mb-4 text-cyan-300">
        On the frontend side, I’ve employed <strong>SvelteKit</strong> and <strong>Tailwind CSS</strong> to create this 
        neon-themed, cyberpunk atmosphere. The interface features smooth transitions, dynamic animations, and minimal load 
        times. Whether you’re a casual movie buff or someone who monitors every new release, I wanted to ensure the system 
        feels both welcoming and cutting-edge.
      </p>
      <p class="leading-relaxed mb-8 text-cyan-300">
        Ultimately, my goal is to blend scalability, security, and performance with a distinctive sci-fi flair. 
        By combining a robust technology stack with modern design principles, I’ve created a reservation system that 
        showcases my passion for both software engineering and user experience.
      </p>
  
      <div class="flex flex-col sm:flex-row items-center justify-between">
        <!-- Return Home Button -->
        <a 
          href="/cinemas"
          class="
            inline-block 
            bg-cyan-600 
            text-black 
            font-bold 
            py-2 
            px-6 
            rounded 
            hover:bg-cyan-500 
            transition-colors 
            shadow-[0_0_6px_#0ff]
            mb-4 sm:mb-0
          "
        >
        To search for movies
        </a>
  
        <!-- Social Icons -->
        <div class="flex space-x-4">
          <!-- GitHub -->
          <a 
            href="https://https://github.com/incatswetrust" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-cyan-300 hover:text-cyan-100 transition-colors"
          >
            <svg 
              fill="currentColor" 
              viewBox="0 0 24 24" 
              class="w-6 h-6"
            >
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
          </a>
  
  
          <!-- LinkedIn -->
          <a 
            href="https:/www.linkedin.com/in/oleksii-chaikovskyi-14b508196" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-cyan-300 hover:text-cyan-100 transition-colors"
          >
            <svg 
              fill="currentColor" 
              stroke="currentColor" 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="0" 
              class="w-6 h-6" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke="none" 
                d="M16 8a6 6 0 016 6v7h-4v-7
                   a2 2 0 00-2-2 2 2 0 00-2 2v7
                   h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
              ></path>
              <circle cx="4" cy="4" r="2" stroke="none"></circle>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>
  