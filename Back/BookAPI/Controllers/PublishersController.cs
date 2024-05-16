using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookAPI.Models;
using Microsoft.AspNetCore.Authorization;

namespace BookAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PublishersController : ControllerBase
    {
        private readonly BookDbContext _context;

        public PublishersController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/Publishers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ModelViewPublisher>>> GetPublishers()
        {
            var publishers = await _context.Publishers.ToListAsync();

            if (publishers.Count >= 1)
            {
                var model = publishers.Select(x => new ModelViewPublisher()
                {
                    PublisherId = x.PublisherId,
                    PublisherName = x.PublisherName
                }).ToList();
                return model;
            }

            return NoContent();
        }

        // GET: api/Publishers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ModelViewPublisher>> GetPublisher(int id)
        {
            var publisher = await _context.Publishers.FindAsync(id);

            if (publisher == null)
            {
                return NotFound();
            }

            var model = new ModelViewPublisher()
            {
                PublisherId = publisher.PublisherId,
                PublisherName = publisher.PublisherName
            };

            return model;
        }

        // PUT: api/Publishers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPublisher(int id, ModelViewPublisher model)
        {
            if (id != model.PublisherId)
            {
                return BadRequest();
            }

            var publisher = new Publisher()
            {
                PublisherId = model.PublisherId,
                PublisherName = model.PublisherName
            };

            _context.Entry(publisher).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PublisherExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Publishers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ModelViewPublisher>> PostPublisher(ModelViewPublisher model)
        {
            if (model == null)
            {
                return NoContent();
            }

            var publisher = new Publisher()
            {
                PublisherName = model.PublisherName
            };

            _context.Publishers.Add(publisher);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPublisher", new { id = model.PublisherId }, model);
        }

        // DELETE: api/Publishers/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePublisher(int id)
        {
            var publisher = await _context.Publishers.FindAsync(id);
            if (publisher == null)
            {
                return NotFound();
            }

            _context.Publishers.Remove(publisher);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PublisherExists(int id)
        {
            return _context.Publishers.Any(e => e.PublisherId == id);
        }
    }
}
