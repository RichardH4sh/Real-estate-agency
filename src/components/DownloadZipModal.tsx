import React, { useState } from 'react';
import { useRealEstate } from '../context/RealEstateContext';
import JSZip from 'jszip';
import { Download, FileArchive, CheckCircle, RefreshCw, X, Server, Globe, ExternalLink } from 'lucide-react';

interface DownloadZipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadZipModal: React.FC<DownloadZipModalProps> = ({ isOpen, onClose }) => {
  const { companyInfo, properties, agents, bookings } = useRealEstate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const zip = new JSZip();

      // Compiled Static HTML package
      const staticExportHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${companyInfo.name} - Real Estate Agency</title>
  <meta name="description" content="${companyInfo.slogan}" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f8fafc; color: #1e293b; }
    h1, h2, h3 { font-family: 'Playfair Display', serif; }
  </style>
</head>
<body class="p-6 md:p-12 max-w-7xl mx-auto">
  <header class="border-b pb-6 mb-8 flex flex-wrap justify-between items-center gap-4">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">${companyInfo.name}</h1>
      <p class="text-sm text-gray-600 mt-1">${companyInfo.slogan}</p>
    </div>
    <div class="text-sm text-right text-gray-600">
      <p class="font-semibold text-gray-900">${companyInfo.phone}</p>
      <p>${companyInfo.email}</p>
      <p class="text-xs text-gray-500">${companyInfo.address}, ${companyInfo.city}</p>
    </div>
  </header>

  <main>
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Current Real Estate Portfolio (${properties.length})</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${properties
          .map(
            p => `
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <img src="${p.images[0]}" alt="${p.title}" class="w-full h-56 object-cover" />
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span class="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full uppercase">${p.type}</span>
                <h3 class="text-lg font-bold text-gray-900 mt-2">${p.title}</h3>
                <p class="text-xl font-bold text-amber-700 mt-1">$${p.price.toLocaleString()}</p>
                <p class="text-xs text-gray-500 mt-1">${p.location.neighborhood}, ${p.location.city}</p>
                <p class="text-xs text-gray-600 mt-3 line-clamp-2">${p.description}</p>
              </div>
              <div class="mt-4 pt-4 border-t text-xs text-gray-500 flex justify-between">
                <span>${p.type === 'land' ? `${p.specs.lotSizeAcres} Acres` : `${p.specs.bedrooms} Beds &bull; ${p.specs.bathrooms} Baths`}</span>
                <span>${p.specs.areaSqFt ? `${p.specs.areaSqFt} sqft` : 'Parcel'}</span>
              </div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>

    <div class="mt-12 pt-8 border-t">
      <h2 class="text-2xl font-bold mb-4">Advisory Team</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        ${agents
          .map(
            a => `
          <div class="bg-white p-4 rounded-xl border border-gray-200 text-center">
            <img src="${a.avatar}" alt="${a.name}" class="w-16 h-16 rounded-full mx-auto object-cover mb-2" />
            <h4 class="font-bold text-gray-900 text-sm">${a.name}</h4>
            <p class="text-xs text-gray-500">${a.title}</p>
            <p class="text-xs text-amber-700 font-semibold mt-1">${a.phone}</p>
            <p class="text-xs text-gray-400">${a.email}</p>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  </main>

  <footer class="mt-16 pt-8 border-t text-center text-xs text-gray-500">
    <p>&copy; ${new Date().getFullYear()} ${companyInfo.name}. All rights reserved.</p>
  </footer>
</body>
</html>`;

      zip.file('index.html', staticExportHtml);

      // JSON Data exports for backup or database loading
      const dataFolder = zip.folder('data');
      if (dataFolder) {
        dataFolder.file('properties.json', JSON.stringify(properties, null, 2));
        dataFolder.file('agents.json', JSON.stringify(agents, null, 2));
        dataFolder.file('company.json', JSON.stringify(companyInfo, null, 2));
        dataFolder.file('bookings.json', JSON.stringify(bookings, null, 2));
      }

      const readme = `# ${companyInfo.name} - Real Estate Website Deployment Bundle

This ZIP file has been compiled and is ready for upload to any web hosting provider.

### Deployment Options:
1. **Netlify Drop**: Drag and drop this folder onto https://app.netlify.com/drop
2. **cPanel / Apache / Nginx**: Unpack files into your \`public_html\` directory.
3. **Vercel / GitHub Pages**: Deploy directory directly.

Contains:
- \`index.html\`: Ready-to-serve client website
- \`/data/properties.json\`: Full property listings database (${properties.length} items)
- \`/data/agents.json\`: Agent profiles and contact data
- \`/data/company.json\`: Corporate agency info & settings
- \`/data/bookings.json\`: Tour bookings schedule
`;
      zip.file('README.md', readme);

      const content = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `haven_hearth_website_compiled_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setHasDownloaded(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      id="download-zip-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <FileArchive className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 font-serif-title">
            Export & Download Website (.ZIP)
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Your real estate platform is packaged with all compiled HTML, CSS styles, properties ({properties.length} listings), high-res photo assets, and agent contact rosters.
          </p>
        </div>

        {/* Download action button */}
        <div className="space-y-3">
          <button
            id="modal-trigger-download-zip"
            type="button"
            onClick={handleDownload}
            disabled={isGenerating}
            className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isGenerating ? 'Packaging Website Files...' : 'Download ZIP File Now'}</span>
          </button>

          {hasDownloaded && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Archive downloaded! Check your browser's Downloads folder.</span>
            </div>
          )}
        </div>

        {/* Quick upload guide */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs text-stone-600 space-y-2">
          <p className="font-bold text-stone-800 uppercase tracking-wider text-[10px]">
            Hosting Upload Instructions:
          </p>
          <ul className="list-disc list-inside space-y-1 text-stone-600">
            <li>
              <strong>cPanel / Apache / Nginx:</strong> Upload and extract into your hosting root (<code className="font-mono text-amber-800">public_html</code>).
            </li>
            <li>
              <strong>Netlify:</strong> Drag and drop the folder on <span className="font-mono text-amber-800">app.netlify.com/drop</span>.
            </li>
            <li>
              <strong>Vercel / Cloudflare Pages:</strong> Connect repository or upload compiled folder.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
