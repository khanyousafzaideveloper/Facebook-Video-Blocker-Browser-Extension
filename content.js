// Enhanced Facebook Video Blocker Extension

// Configuration
const config = {
  selectors: {
    // Video-related link patterns
    videoLinks: [
      'a[href*="/videos"]',
      'a[href*="/reel"]',
      'a[href*="/watch"]',
      'a[aria-label*="Video"]',
      'a[aria-label*="Videos"]',
      'a[aria-label*="Reels"]',
      'a[aria-label*="Watch"]'
    ],
    // Video containers and elements
    videoContainers: [
      'div[role="article"]',
      'div[role="navigation"]',
      'div[role="menuitem"]',
      'div[data-pagelet*="Video"]',
      'div[data-pagelet*="Reel"]',
      'div[data-pagelet*="Watch"]'
    ],
    // Sidebar specific selectors
    sidebarItems: [
      'div[role="complementary"]',
      'div[data-pagelet="RightRail"]',
      'aside'
    ]
  },
  keywords: ["videos", "reels", "watch", "video", "reel"],
  redirectPaths: ["/videos/", "/reel/", "/watch/"],
  redirectUrl: "https://www.facebook.com/"
};

// Remove video elements from the page
function removeVideoElements() {
  // Remove by text content
  removeByTextContent();
  
  // Remove by href patterns
  removeByHrefPattern();
  
  // Remove video iframes and players
  removeVideoPlayers();
  
  // Remove from top navigation
  removeFromTopNav();
  
  // Remove from sidebar
  removeFromSidebar();
  
  // Remove video tabs
  removeVideoTabs();
  
  // Remove sponsored video posts
  removeSponsoredVideos();
}

// Remove elements containing video-related text
function removeByTextContent() {
  const elements = document.querySelectorAll("span, a, div[role='button']");
  
  elements.forEach(el => {
    if (!el.textContent) return;
    
    const text = el.textContent.toLowerCase().trim();
    const hasKeyword = config.keywords.some(keyword => 
      text === keyword || 
      text.startsWith(keyword + " ") || 
      text.endsWith(" " + keyword)
    );
    
    if (hasKeyword) {
      // Try to find the appropriate container
      let container = el.closest('a[role="link"]') || 
                     el.closest('div[role="menuitem"]') ||
                     el.closest('div[role="listitem"]') ||
                     el.closest('li') ||
                     el.closest('div[role="article"]');
      
      // For navigation items
      if (!container) {
        container = el.closest('div[style*="flex"]');
        // Ensure we're not removing the entire page
        if (container && container.closest('nav, header, [role="navigation"]')) {
          container = el.closest('a, div[role="button"]');
        }
      }
      
      if (container && container !== document.body) {
        container.style.display = 'none';
        container.remove();
      }
    }
  });
}

// Remove elements with video-related href patterns
function removeByHrefPattern() {
  config.selectors.videoLinks.forEach(selector => {
    document.querySelectorAll(selector).forEach(link => {
      // Find the post/article container
      let container = link.closest('div[role="article"]');
      
      // If not in article, might be navigation
      if (!container) {
        container = link.closest('div[role="menuitem"]') ||
                   link.closest('div[role="listitem"]') ||
                   link.closest('li') ||
                   link.closest('div[role="button"]');
      }
      
      // Last resort - get parent divs
      if (!container) {
        container = link.closest('div');
      }
      
      if (container && container !== document.body) {
        container.style.display = 'none';
        container.remove();
      }
    });
  });
}

// Remove video players and iframes
function removeVideoPlayers() {
  const videoSelectors = [
    'video',
    'iframe[src*="facebook.com/plugins/video"]',
    'div[data-video-id]',
    'div[class*="video"]',
    'div[data-pagelet*="Video"]'
  ];
  
  videoSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      const article = el.closest('div[role="article"]');
      if (article) {
        article.style.display = 'none';
        article.remove();
      } else if (el.tagName === 'VIDEO' || el.tagName === 'IFRAME') {
        el.remove();
      }
    });
  });
}

// Remove video items from top navigation bar
function removeFromTopNav() {
  // Target the top navigation area
  const navSelectors = [
    'div[role="navigation"]',
    'header',
    'nav',
    '[data-pagelet*="Navigation"]'
  ];
  
  navSelectors.forEach(navSelector => {
    document.querySelectorAll(navSelector).forEach(nav => {
      // Find video-related links within navigation
      const videoLinks = nav.querySelectorAll(
        'a[href*="/videos"], a[href*="/watch"], a[aria-label*="Video"], a[aria-label*="Watch"]'
      );
      
      videoLinks.forEach(link => {
        // Remove the tab/button container
        const container = link.closest('div[role="button"]') ||
                         link.closest('div[role="tab"]') ||
                         link.closest('div[tabindex]') ||
                         link.parentElement;
        
        if (container && container !== nav) {
          container.style.display = 'none';
          container.remove();
        }
      });
    });
  });
}

// Remove video items from sidebar
function removeFromSidebar() {
  config.selectors.sidebarItems.forEach(sidebarSelector => {
    document.querySelectorAll(sidebarSelector).forEach(sidebar => {
      // Look for video-related content in sidebar
      const videoElements = sidebar.querySelectorAll(
        'a[href*="/videos"], a[href*="/watch"], a[href*="/reel"]'
      );
      
      videoElements.forEach(el => {
        const container = el.closest('div[role="listitem"]') ||
                         el.closest('li') ||
                         el.closest('div[role="article"]') ||
                         el.parentElement;
        
        if (container && container !== sidebar) {
          container.style.display = 'none';
          container.remove();
        }
      });
      
      // Also check by text content in sidebar
      sidebar.querySelectorAll('span, a').forEach(el => {
        const text = el.textContent.toLowerCase().trim();
        if (config.keywords.some(k => text === k || text.startsWith(k + " "))) {
          const container = el.closest('div[role="listitem"]') ||
                           el.closest('li') ||
                           el.closest('a');
          
          if (container && container !== sidebar) {
            container.style.display = 'none';
            container.remove();
          }
        }
      });
    });
  });
}

// Remove video tabs
function removeVideoTabs() {
  const tabSelectors = [
    'div[role="tab"][aria-label*="Video"]',
    'div[role="tab"][aria-label*="Watch"]',
    'div[role="tab"] a[href*="/videos"]',
    'div[role="tab"] a[href*="/watch"]'
  ];
  
  tabSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(tab => {
      const container = tab.closest('div[role="tab"]') || tab;
      container.style.display = 'none';
      container.remove();
    });
  });
}

// Remove sponsored video posts
function removeSponsoredVideos() {
  document.querySelectorAll('video').forEach(video => {
    const article = video.closest('div[role="article"]');
    if (article) {
      article.style.display = 'none';
      article.remove();
    }
  });
}

// Redirect if on video page
function redirectIfOnVideoPage() {
  const currentPath = location.pathname;
  const shouldRedirect = config.redirectPaths.some(path => currentPath.includes(path));
  
  if (shouldRedirect) {
    console.log(`[FB Video Blocker] Blocked ${currentPath} -> redirecting to homepage`);
    window.location.replace(config.redirectUrl);
  }
}

// Intercept clicks on video links
function interceptVideoLinks() {
  const allVideoLinks = config.selectors.videoLinks.join(', ');
  
  document.querySelectorAll(allVideoLinks).forEach(link => {
    // Remove existing listeners by cloning
    const newLink = link.cloneNode(true);
    link.parentNode?.replaceChild(newLink, link);
    
    newLink.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      console.log("[FB Video Blocker] Blocked video link click");
      window.location.replace(config.redirectUrl);
    }, true);
  });
}

// Watch for URL changes (SPA navigation)
let lastUrl = location.href;
setInterval(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    redirectIfOnVideoPage();
    setTimeout(removeVideoElements, 100);
  }
}, 500);

// Initial execution
console.log("[FB Video Blocker] Extension loaded");
redirectIfOnVideoPage();
removeVideoElements();
interceptVideoLinks();

// Watch for DOM changes with debouncing
let debounceTimer;
const observer = new MutationObserver(() => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    removeVideoElements();
    interceptVideoLinks();
  }, 100);
});

// Start observing
if (document.body) {
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  });
}

// Run periodically as backup (every 2 seconds)
setInterval(() => {
  removeVideoElements();
}, 2000);